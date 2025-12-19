const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: String,
  color: String,
  material: String,
  sku: { type: String, unique: true, sparse: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0 },
  images: [String],
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
});

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  images: [String],
  helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const seoSchema = new mongoose.Schema({
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  slug: { type: String, unique: true, sparse: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 2000 },
  shortDescription: { type: String, maxlength: 500 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: String, required: true },
  sku: { type: String, unique: true, required: true },

  // Pricing
  basePrice: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  costPrice: { type: Number, min: 0 },
  currency: { type: String, default: 'USD' },

  // Inventory
  stock: { type: Number, required: true, min: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  trackInventory: { type: Boolean, default: true },
  allowBackorder: { type: Boolean, default: false },

  // Variants
  variants: [variantSchema],
  hasVariants: { type: Boolean, default: false },

  // Media
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  }],
  videos: [{ url: String, title: String }],

  // Physical properties
  weight: { type: Number, min: 0 },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },

  // Status and visibility
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'archived'],
    default: 'draft'
  },
  featured: { type: Boolean, default: false },
  visibility: {
    type: String,
    enum: ['public', 'private', 'hidden'],
    default: 'public'
  },

  // Reviews and ratings
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },

  // SEO
  seo: seoSchema,

  // Tags and attributes
  tags: [String],
  attributes: [{
    name: String,
    value: String,
    type: { type: String, enum: ['text', 'number', 'boolean', 'date'] }
  }],

  // Shipping
  shippingClass: String,
  freeShipping: { type: Boolean, default: false },
  shippingWeight: Number,

  // Related products
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  crossSells: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  upSells: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

  // Analytics
  views: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },

  // Seller information
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Timestamps
  publishedAt: Date,
  lastModified: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
productSchema.virtual('isOnSale').get(function() {
  return this.salePrice && this.salePrice < this.basePrice;
});

productSchema.virtual('finalPrice').get(function() {
  return this.salePrice || this.basePrice;
});

productSchema.virtual('discountPercentage').get(function() {
  if (!this.isOnSale) return 0;
  return Math.round(((this.basePrice - this.salePrice) / this.basePrice) * 100);
});

productSchema.virtual('isInStock').get(function() {
  return this.stock > 0 || this.allowBackorder;
});

productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.lowStockThreshold && this.stock > 0;
});

// Middleware to update average rating
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
    this.totalReviews = this.reviews.length;
  }
  return this.save();
};

// Pre-save middleware
productSchema.pre('save', function(next) {
  this.lastModified = new Date();

  // Generate slug if not exists
  if (!this.seo.slug) {
    this.seo.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  next();
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'seo.slug': 1 });
productSchema.index({ featured: -1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);