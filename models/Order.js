const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant: {
    size: String,
    color: String,
    material: String
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 }
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: String,
  street: { type: String, required: true },
  apartment: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: String
});

const paymentSchema = new mongoose.Schema({
  method: { 
    type: String, 
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer', 'cash_on_delivery'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending' 
  },
  transactionId: String,
  paymentIntentId: String,
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  gateway: String,
  gatewayResponse: mongoose.Schema.Types.Mixed,
  refunds: [{
    amount: Number,
    reason: String,
    refundId: String,
    processedAt: Date,
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  processedAt: Date
});

const trackingSchema = new mongoose.Schema({
  carrier: String,
  trackingNumber: String,
  trackingUrl: String,
  estimatedDelivery: Date,
  events: [{
    status: String,
    description: String,
    location: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Order items
  items: [orderItemSchema],
  
  // Pricing
  subtotal: { type: Number, required: true, min: 0 },
  taxAmount: { type: Number, default: 0, min: 0 },
  shippingCost: { type: Number, default: 0, min: 0 },
  discountAmount: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD' },
  
  // Discounts and coupons
  coupons: [{
    code: String,
    type: { type: String, enum: ['percentage', 'fixed'] },
    value: Number,
    discount: Number
  }],
  
  // Status
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending' 
  },
  
  // Addresses
  shippingAddress: { type: shippingAddressSchema, required: true },
  billingAddress: { type: shippingAddressSchema, required: true },
  
  // Payment
  payment: paymentSchema,
  
  // Shipping
  shipping: {
    method: String,
    cost: { type: Number, default: 0 },
    estimatedDelivery: Date,
    tracking: trackingSchema
  },
  
  // Order timeline
  timeline: [{
    status: String,
    description: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Notes and communication
  customerNotes: String,
  adminNotes: String,
  
  // Fulfillment
  fulfillmentStatus: {
    type: String,
    enum: ['unfulfilled', 'partially_fulfilled', 'fulfilled'],
    default: 'unfulfilled'
  },
  
  // Returns and exchanges
  returns: [{
    items: [{
      orderItem: { type: mongoose.Schema.Types.ObjectId },
      quantity: Number,
      reason: String
    }],
    status: { 
      type: String, 
      enum: ['requested', 'approved', 'rejected', 'processing', 'completed'] 
    },
    requestedAt: { type: Date, default: Date.now },
    processedAt: Date,
    refundAmount: Number,
    notes: String
  }],
  
  // Analytics
  source: { type: String, default: 'web' }, // web, mobile, api
  referrer: String,
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,
  
  // Timestamps
  placedAt: { type: Date, default: Date.now },
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

orderSchema.virtual('canCancel').get(function() {
  return ['pending', 'confirmed'].includes(this.status);
});

orderSchema.virtual('canReturn').get(function() {
  return this.status === 'delivered' && 
         this.deliveredAt && 
         (Date.now() - this.deliveredAt.getTime()) <= (30 * 24 * 60 * 60 * 1000); // 30 days
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  
  // Update timeline
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      description: `Order status changed to ${this.status}`,
      timestamp: new Date()
    });
    
    // Update status timestamps
    switch (this.status) {
      case 'confirmed':
        this.confirmedAt = new Date();
        break;
      case 'shipped':
        this.shippedAt = new Date();
        break;
      case 'delivered':
        this.deliveredAt = new Date();
        break;
      case 'cancelled':
        this.cancelledAt = new Date();
        break;
    }
  }
  
  next();
});

// Methods
orderSchema.methods.addTrackingInfo = function(carrier, trackingNumber, trackingUrl) {
  this.shipping.tracking = {
    carrier,
    trackingNumber,
    trackingUrl,
    events: [{
      status: 'shipped',
      description: 'Package shipped',
      timestamp: new Date()
    }]
  };
  return this.save();
};

orderSchema.methods.updateTrackingStatus = function(status, description, location) {
  if (!this.shipping.tracking) {
    throw new Error('No tracking information available');
  }
  
  this.shipping.tracking.events.push({
    status,
    description,
    location,
    timestamp: new Date()
  });
  
  return this.save();
};

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ placedAt: -1 });

module.exports = mongoose.model('Order', orderSchema);