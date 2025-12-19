import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiMenu, FiHeart, FiBell } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import SearchBar from '../UI/SearchBar';
import CartDropdown from '../Cart/CartDropdown';
import UserDropdown from '../UI/UserDropdown';

const Header = ({ isAdmin, onToggleSidebar }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { getItemsCount } = useCart();
  
  const searchRef = useRef(null);
  const cartRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cartItemsCount = getItemsCount();

  return (
    <header className="header">
      <div className="header-container">
        {/* Left Section */}
        <div className="header-left">
          {(isAdmin || location.pathname.startsWith('/profile')) && (
            <button 
              className="sidebar-toggle"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
            >
              <FiMenu />
            </button>
          )}
          
          <Link to="/" className="logo">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="logo-content"
            >
              <span className="logo-text">ShopSmart</span>
            </motion.div>
          </Link>
        </div>

        {/* Center Section - Navigation */}
        {!isAdmin && (
          <nav className="header-nav hidden-mobile">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
            >
              Contact
            </Link>
          </nav>
        )}

        {/* Right Section */}
        <div className="header-right">
          {/* Search */}
          {!isAdmin && (
            <div className="search-container" ref={searchRef}>
              <button
                className="header-icon-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <FiSearch />
              </button>
              
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="search-dropdown"
                  >
                    <SearchBar onClose={() => setSearchOpen(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Wishlist */}
          {!isAdmin && isAuthenticated && (
            <Link to="/wishlist" className="header-icon-btn" aria-label="Wishlist">
              <FiHeart />
            </Link>
          )}

          {/* Cart */}
          {!isAdmin && (
            <div className="cart-container" ref={cartRef}>
              <button
                className="header-icon-btn cart-btn"
                onClick={() => setCartOpen(!cartOpen)}
                aria-label={`Cart (${cartItemsCount} items)`}
              >
                <FiShoppingCart />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="cart-badge"
                  >
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {cartOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="cart-dropdown"
                  >
                    <CartDropdown onClose={() => setCartOpen(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Notifications (Admin only) */}
          {isAdmin && (
            <button className="header-icon-btn" aria-label="Notifications">
              <FiBell />
              <span className="notification-badge">3</span>
            </button>
          )}

          {/* User Menu */}
          <div className="user-container" ref={userRef}>
            {isAuthenticated ? (
              <>
                <button
                  className="user-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User menu"
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.firstName} 
                      className="user-avatar"
                    />
                  ) : (
                    <div className="user-avatar-placeholder">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                  )}
                  <span className="user-name hidden-mobile">
                    {user?.firstName}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="user-dropdown"
                    >
                      <UserDropdown 
                        isAdmin={isAdmin}
                        onClose={() => setUserMenuOpen(false)} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="auth-buttons">
                <Link 
                  to="/login" 
                  className="btn btn-ghost btn-sm"
                  state={{ from: location.pathname }}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
