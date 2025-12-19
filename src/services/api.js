import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/refresh-token`,
            { refreshToken }
          );

          const { token: newToken, refreshToken: newRefreshToken } = response.data.data;
          
          // Update tokens
          Cookies.set('token', newToken, { expires: 7 });
          Cookies.set('refreshToken', newRefreshToken, { expires: 30 });

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Cookies.remove('token');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', email),
  resetPassword: (token, passwordData) => api.post(`/auth/reset-password/${token}`, passwordData),
  verifyEmail: (token) => api.post(`/auth/verify-email/${token}`),
  resendVerification: () => api.post('/auth/resend-verification'),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
};

// Products API
export const productsAPI = {
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/products?${queryString}`);
  },
  getProduct: (id) => api.get(`/products/${id}`),
  getFeaturedProducts: () => api.get('/products/featured'),
  getCategories: () => api.get('/products/categories'),
  searchProducts: (query, filters = {}) => {
    const params = { q: query, ...filters };
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/products/search?${queryString}`);
  },
  getProductReviews: (productId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/products/${productId}/reviews?${queryString}`);
  },
  addReview: (productId, reviewData) => api.post(`/products/${productId}/reviews`, reviewData),
  updateReview: (productId, reviewId, reviewData) => 
    api.put(`/products/${productId}/reviews/${reviewId}`, reviewData),
  deleteReview: (productId, reviewId) => api.delete(`/products/${productId}/reviews/${reviewId}`),
  getRelatedProducts: (productId) => api.get(`/products/${productId}/related`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity, variant) => 
    api.post('/cart/add', { productId, quantity, variant }),
  updateCartItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
  applyCoupon: (couponCode) => api.post('/cart/coupon', { code: couponCode }),
  removeCoupon: () => api.delete('/cart/coupon'),
  syncCart: (cartData) => api.post('/cart/sync', cartData),
};

// Orders API
export const ordersAPI = {
  getOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/orders?${queryString}`);
  },
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),
  cancelOrder: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),
  trackOrder: (id) => api.get(`/orders/${id}/tracking`),
  requestReturn: (id, returnData) => api.post(`/orders/${id}/return`, returnData),
  getOrderInvoice: (id) => api.get(`/orders/${id}/invoice`, { responseType: 'blob' }),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (addressData) => api.post('/users/addresses', addressData),
  updateAddress: (id, addressData) => api.put(`/users/addresses/${id}`, addressData),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
  setDefaultAddress: (id) => api.put(`/users/addresses/${id}/default`),
  getWishlist: () => api.get('/users/wishlist'),
  addToWishlist: (productId) => api.post('/users/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/users/wishlist/${productId}`),
  getLoyaltyPoints: () => api.get('/users/loyalty-points'),
  getNotifications: () => api.get('/users/notifications'),
  markNotificationRead: (id) => api.put(`/users/notifications/${id}/read`),
  updatePreferences: (preferences) => api.put('/users/preferences', preferences),
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: (orderData) => api.post('/payment/create-intent', orderData),
  confirmPayment: (paymentIntentId, paymentMethodId) => 
    api.post('/payment/confirm', { paymentIntentId, paymentMethodId }),
  getPaymentMethods: () => api.get('/payment/methods'),
  addPaymentMethod: (paymentMethodData) => api.post('/payment/methods', paymentMethodData),
  deletePaymentMethod: (id) => api.delete(`/payment/methods/${id}`),
  processRefund: (orderId, amount, reason) => 
    api.post('/payment/refund', { orderId, amount, reason }),
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getRecentOrders: () => api.get('/admin/dashboard/recent-orders'),
  getSalesChart: (period) => api.get(`/admin/dashboard/sales-chart?period=${period}`),
  
  // Products Management
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/products?${queryString}`);
  },
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  bulkUpdateProducts: (updates) => api.put('/admin/products/bulk', updates),
  
  // Orders Management
  getOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/orders?${queryString}`);
  },
  updateOrderStatus: (id, status, notes) => 
    api.put(`/admin/orders/${id}/status`, { status, notes }),
  addTrackingInfo: (id, trackingData) => 
    api.post(`/admin/orders/${id}/tracking`, trackingData),
  
  // Users Management
  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/users?${queryString}`);
  },
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Analytics
  getAnalytics: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/analytics?${queryString}`);
  },
  getTopProducts: (period) => api.get(`/admin/analytics/top-products?period=${period}`),
  getCustomerAnalytics: () => api.get('/admin/analytics/customers'),
  
  // Categories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (categoryData) => api.post('/admin/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/admin/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  
  // Coupons
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (couponData) => api.post('/admin/coupons', couponData),
  updateCoupon: (id, couponData) => api.put(`/admin/coupons/${id}`, couponData),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
};

// File upload API
export const uploadAPI = {
  uploadImage: (file, folder = 'products') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  uploadMultipleImages: (files, folder = 'products') => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('folder', folder);
    
    return api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteImage: (imageUrl) => api.delete('/upload/image', { data: { imageUrl } }),
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return {
        status,
        message: data.message || 'An error occurred',
        errors: data.errors || []
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        status: 0,
        message: 'Network error. Please check your connection.',
        errors: []
      };
    } else {
      // Something else happened
      return {
        status: 0,
        message: error.message || 'An unexpected error occurred',
        errors: []
      };
    }
  },

  // Format API response
  formatResponse: (response) => {
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message || 'Success'
    };
  },

  // Create query string from object
  createQueryString: (params) => {
    const filtered = Object.entries(params)
      .filter(([key, value]) => value !== undefined && value !== null && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    return new URLSearchParams(filtered).toString();
  },

  // Debounced API call
  debounce: (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }
};

export default api;