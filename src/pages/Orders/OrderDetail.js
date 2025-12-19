import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiTruck, FiMapPin, FiUser, FiCreditCard } from 'react-icons/fi';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If order data is not passed via state, try to fetch it
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:5000/api/orders/${id}`);
          const data = await response.json();

          if (data.success) {
            setOrder(data.data.order);
          } else {
            setError('Order not found');
          }
        } catch (err) {
          setError('Failed to load order');
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    } else if (order) {
      setLoading(false);
    }
  }, [id, order]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return colors[status] || 'status-default';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FiCheckCircle />;
      case 'shipped':
        return <FiTruck />;
      case 'delivered':
        return <FiPackage />;
      default:
        return <FiPackage />;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="order-detail-page">
      <div className="container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
  if (!order) return null;

  return (
    <div className="order-detail-page">
      <div className="container">
        {/* Order Confirmation Header */}
        <div className="order-confirmation">
          <div className="confirmation-icon">
            <FiCheckCircle />
          </div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. Your order has been successfully placed.</p>
          <div className="order-number">
            <strong>Order #{order.orderNumber}</strong>
          </div>
        </div>

        {/* Order Status */}
        <div className="order-status-card">
          <div className="status-header">
            <h3>Order Status</h3>
            <span className={`status-badge ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <p>Order placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>

        <div className="order-content">
          {/* Order Items */}
          <div className="order-section">
            <h3>Order Items</h3>
            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img
                      src={item.product?.images?.[0]?.url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'}
                      alt={item.product?.name}
                    />
                  </div>
                  <div className="item-details">
                    <h4>{item.product?.name}</h4>
                    <div className="item-meta">
                      <span>Quantity: {item.quantity}</span>
                      <span>₹{item.price.toLocaleString('en-IN')} each</span>
                    </div>
                    {item.variant && (
                      <div className="item-variant">
                        {item.variant.size && <span>Size: {item.variant.size}</span>}
                        {item.variant.color && <span>Color: {item.variant.color}</span>}
                      </div>
                    )}
                  </div>
                  <div className="item-total">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <h3>Order Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{order.pricing.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>₹{order.pricing.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>₹{order.pricing.shipping.toLocaleString('en-IN')}</span>
              </div>
              {order.pricing.discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-₹{order.pricing.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <hr />
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{order.pricing.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Billing Info */}
          <div className="order-addresses">
            {/* Customer Info */}
            <div className="address-section">
              <div className="section-header">
                <FiUser />
                <h3>Customer Information</h3>
              </div>
              <div className="address-content">
                <p><strong>{order.customerInfo.firstName} {order.customerInfo.lastName}</strong></p>
                <p>{order.customerInfo.email}</p>
                <p>{order.customerInfo.phone}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="address-section">
              <div className="section-header">
                <FiMapPin />
                <h3>Shipping Address</h3>
              </div>
              <div className="address-content">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="address-section">
              <div className="section-header">
                <FiCreditCard />
                <h3>Payment Method</h3>
              </div>
              <div className="address-content">
                <p><strong>{order.paymentMethod === 'test' ? 'Test Payment' : 'Credit/Debit Card'}</strong></p>
                <p>Status: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="order-actions">
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            Continue Shopping
          </button>
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
