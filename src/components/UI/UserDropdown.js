import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiSettings, FiLogOut, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const UserDropdown = ({ isAdmin, onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="user-dropdown-content">
      <div className="user-info">
        <p className="user-greeting">Hello, {user?.firstName}!</p>
        <p className="user-email">{user?.email}</p>
      </div>
      
      <div className="dropdown-menu">
        {isAdmin ? (
          <>
            <Link to="/admin" className="dropdown-item" onClick={onClose}>
              <FiShield />
              Admin Dashboard
            </Link>
            <Link to="/admin/products" className="dropdown-item" onClick={onClose}>
              <FiShoppingBag />
              Manage Products
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="dropdown-item" onClick={onClose}>
              <FiUser />
              My Profile
            </Link>
            <Link to="/orders" className="dropdown-item" onClick={onClose}>
              <FiShoppingBag />
              My Orders
            </Link>
            <Link to="/wishlist" className="dropdown-item" onClick={onClose}>
              <FiSettings />
              Wishlist
            </Link>
          </>
        )}
        
        <button className="dropdown-item logout-btn" onClick={handleLogout}>
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;