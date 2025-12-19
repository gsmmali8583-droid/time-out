import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartDropdown = ({ onClose }) => {
  const { items, getTotal, getItemsCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-dropdown-content">
        <p className="empty-cart">Your cart is empty</p>
        <Link to="/products" className="btn btn-primary" onClick={onClose}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-dropdown-content">
      <div className="cart-items">
        {items.slice(0, 3).map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.product.images?.[0]?.url || 'https://via.placeholder.com/50'} alt={item.product.name} />
            <div className="item-details">
              <h4>{item.product.name}</h4>
              <p>${item.price} x {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="cart-total">
          <strong>Total: ${getTotal().toFixed(2)}</strong>
        </div>
        <Link to="/cart" className="btn btn-primary" onClick={onClose}>
          View Cart ({getItemsCount()})
        </Link>
      </div>
    </div>
  );
};

export default CartDropdown;