import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiTruck, FiMapPin, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    items,
    getSubtotal,
    getTax,
    getTotal,
    clearCart
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
  });

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const [billingAddress, setBillingAddress] = useState({
    ...shippingAddress,
    sameAsShipping: true,
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const handleCustomerInfoChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value,
    });

    if (billingAddress.sameAsShipping) {
      setBillingAddress({
        ...billingAddress,
        [name]: value,
      });
    }
  };

  const handleBillingAddressChange = (e) => {
    setBillingAddress({
      ...billingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleCardInfoChange = (e) => {
    setCardInfo({
      ...cardInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async () => {
    // Basic validation
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone) {
      toast.error('Please fill in all customer information');
      return;
    }

    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast.error('Please fill in all shipping address information');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvv || !cardInfo.name) {
        toast.error('Please fill in all payment information');
        return;
      }
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        customerInfo,
        shippingAddress,
        billingAddress: billingAddress.sameAsShipping ? shippingAddress : billingAddress,
        paymentMethod,
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
          variant: item.variant,
        })),
        subtotal: getSubtotal(),
        tax: getTax(),
        total: getTotal(),
      };

      // Create order
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if available
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        // Clear cart
        clearCart();

        // Show success message
        toast.success('Order placed successfully!');

        // Navigate to order confirmation
        navigate(`/orders/${data.data.order._id}`, {
          state: { order: data.data.order }
        });
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <p>Complete your purchase</p>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            {/* Customer Information */}
            <div className="checkout-section">
              <div className="section-header">
                <FiUser />
                <h3>Customer Information</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={customerInfo.firstName}
                    onChange={handleCustomerInfoChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerInfo.lastName}
                    onChange={handleCustomerInfoChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleCustomerInfoChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="checkout-section">
              <div className="section-header">
                <FiMapPin />
                <h3>Shipping Address</h3>
              </div>
              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleShippingAddressChange}
                  placeholder="Street address, apartment, etc."
                  required
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleShippingAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleShippingAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleShippingAddressChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleShippingAddressChange}
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <div className="section-header">
                <FiCreditCard />
                <h3>Payment Method</h3>
              </div>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="test"
                    checked={paymentMethod === 'test'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Test Payment (Free)</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-form">
                  <div className="form-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      name="number"
                      value={cardInfo.number}
                      onChange={handleCardInfoChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardInfo.expiry}
                        onChange={handleCardInfoChange}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="text"
                        name="cvv"
                        value={cardInfo.cvv}
                        onChange={handleCardInfoChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={cardInfo.name}
                      onChange={handleCardInfoChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'test' && (
                <div className="test-payment-notice">
                  <p><strong>Test Payment Mode:</strong> This is a demo payment gateway. No real payment will be processed.</p>
                  <p>Click "Place Order" to complete your test purchase.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
            </div>

            <div className="summary-items">
              {items.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="item-info">
                    <span className="item-name">{item.product.name}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                  </div>
                  <span className="item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <hr />

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{getSubtotal().toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>₹{getTax().toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{getTotal().toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              className="btn btn-primary place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Place Order - ₹${getTotal().toLocaleString('en-IN')}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
