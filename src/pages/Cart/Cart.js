import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    getSubtotal,
    getTax,
    getTotal,
    getItemsCount
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: '/checkout' } });
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FiShoppingBag className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <button onClick={handleContinueShopping} className="btn btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{getItemsCount()} {getItemsCount() === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img
                    src={item.product.images?.[0]?.url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'}
                    alt={item.product.name}
                  />
                </div>

                <div className="item-details">
                  <Link to={`/products/${item.product._id}`} className="item-name">
                    {item.product.name}
                  </Link>
                  <div className="item-price">
                    ₹{item.price.toLocaleString('en-IN')} each
                  </div>
                  {item.variant && (
                    <div className="item-variant">
                      {item.variant.size && <span>Size: {item.variant.size}</span>}
                      {item.variant.color && <span>Color: {item.variant.color}</span>}
                    </div>
                  )}
                </div>

                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= (item.variant?.stock || item.product.stock)}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>

                <div className="item-actions">
                  <button
                    className="btn btn-ghost remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
            </div>

            <div className="summary-content">
              <div className="summary-row">
                <span>Subtotal ({getItemsCount()} items)</span>
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

            {/* Coupon Section */}
            <div className="coupon-section">
              <div className="coupon-input">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button className="btn btn-secondary">Apply</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="summary-actions">
              <button
                className="btn btn-primary checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
                <FiArrowRight />
              </button>

              <button
                className="btn btn-ghost continue-shopping-btn"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>

              <button
                className="btn btn-ghost clear-cart-btn"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
