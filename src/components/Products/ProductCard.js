import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-image">
          <img 
            src={product.images?.[0]?.url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'}
            alt={product.name}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover'
            }}
          />
          {product.finalPrice < product.basePrice && (
            <span className="discount-badge">
              {Math.round(((product.basePrice - product.finalPrice) / product.basePrice) * 100)}% OFF
            </span>
          )}
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          
          <div className="product-rating">
            <div className="stars">
              {[1,2,3,4,5].map((star) => (
                <FiStar 
                  key={star} 
                  className={star <= Math.floor(product.averageRating) ? 'star filled' : 'star'} 
                />
              ))}
            </div>
            <span className="rating-text">
              {product.averageRating} ({product.totalReviews} reviews)
            </span>
          </div>
          
          <div className="product-price">
            {product.finalPrice < product.basePrice ? (
              <>
                <span className="current-price">₹{product.finalPrice.toLocaleString('en-IN')}</span>
                <span className="original-price">₹{product.basePrice.toLocaleString('en-IN')}</span>
              </>
            ) : (
              <span className="current-price">₹{product.basePrice.toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>
      </Link>
      
      <div className="product-actions">
        <button 
          className="btn btn-primary add-to-cart"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <FiShoppingCart />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        
        <button 
          className={`btn btn-ghost wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
          onClick={handleAddToWishlist}
        >
          <FiHeart />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;