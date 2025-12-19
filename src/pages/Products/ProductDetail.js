import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.data.product);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      const success = addToCart(product, null, quantity);
      if (success) {
        navigate('/cart');
      }
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      addToWishlist(product);
    }
  };

  const updateQuantity = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="product-detail-page">
      <div className="container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
  if (!product) return null;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button onClick={() => navigate(-1)} className="btn btn-ghost back-btn">
            <FiArrowLeft /> Back
          </button>
        </div>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={product.images?.[selectedImage]?.url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'}
                alt={product.name}
                className="product-main-image"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>

            {/* Rating */}
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

            {/* Price */}
            <div className="product-price">
              {product.finalPrice < product.basePrice ? (
                <>
                  <span className="current-price">₹{product.finalPrice.toLocaleString('en-IN')}</span>
                  <span className="original-price">₹{product.basePrice.toLocaleString('en-IN')}</span>
                  <span className="discount-badge">
                    {Math.round(((product.basePrice - product.finalPrice) / product.basePrice) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="current-price">₹{product.basePrice.toLocaleString('en-IN')}</span>
              )}
            </div>

            {/* Stock Status */}
            <div className="stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
              {product.shortDescription && (
                <p className="short-description">{product.shortDescription}</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button
                className="btn btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FiShoppingCart />
                {product.stock === 0 ? 'Out of Stock' : `Add to Cart - ₹${(product.finalPrice * quantity).toLocaleString('en-IN')}`}
              </button>

              <button
                className={`btn btn-ghost wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                onClick={handleAddToWishlist}
              >
                <FiHeart />
                {isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Product Details */}
            <div className="product-details">
              <h3>Product Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Category:</span>
                  <span className="value">{product.category}</span>
                </div>
                {product.subcategory && (
                  <div className="detail-item">
                    <span className="label">Subcategory:</span>
                    <span className="value">{product.subcategory}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="label">Brand:</span>
                  <span className="value">{product.brand}</span>
                </div>
                <div className="detail-item">
                  <span className="label">SKU:</span>
                  <span className="value">{product.sku}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
