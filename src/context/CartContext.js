import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload.items || [],
        loading: false
      };

    case 'ADD_ITEM': {
      const { product, variant, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => 
        item.product._id === product._id && 
        JSON.stringify(item.variant) === JSON.stringify(variant)
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem = {
          id: `${product._id}-${JSON.stringify(variant)}`,
          product,
          variant,
          quantity,
          price: variant?.price || product.finalPrice || product.basePrice,
          addedAt: new Date().toISOString()
        };
        newItems = [...state.items, newItem];
      }

      return {
        ...state,
        items: newItems
      };
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== itemId)
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.itemId)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'APPLY_COUPON':
      return {
        ...state,
        coupon: action.payload.coupon,
        discount: action.payload.discount
      };

    case 'REMOVE_COUPON':
      return {
        ...state,
        coupon: null,
        discount: 0
      };

    case 'SET_SHIPPING':
      return {
        ...state,
        shipping: action.payload
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  loading: true,
  coupon: null,
  discount: 0,
  shipping: {
    method: 'standard',
    cost: 0,
    estimatedDays: 5
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({
          type: 'LOAD_CART',
          payload: cartData
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem('cart', JSON.stringify({
        items: state.items,
        coupon: state.coupon,
        discount: state.discount,
        shipping: state.shipping
      }));
    }
  }, [state.items, state.coupon, state.discount, state.shipping, state.loading]);

  // Add item to cart
  const addToCart = (product, variant = null, quantity = 1) => {
    // Check stock availability
    const availableStock = variant?.stock || product.stock;
    if (availableStock < quantity) {
      toast.error(`Only ${availableStock} items available in stock`);
      return false;
    }

    // Check if item already exists in cart
    const existingItem = state.items.find(item => 
      item.product._id === product._id && 
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > availableStock) {
        toast.error(`Cannot add more items. Maximum available: ${availableStock}`);
        return false;
      }
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: { product, variant, quantity }
    });

    toast.success(`${product.name} added to cart`);
    return true;
  };

  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    const item = state.items.find(item => item.id === itemId);
    if (!item) return false;

    const availableStock = item.variant?.stock || item.product.stock;
    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} items available in stock`);
      return false;
    }

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { itemId, quantity }
    });

    if (quantity === 0) {
      toast.success('Item removed from cart');
    }

    return true;
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { itemId }
    });
    toast.success('Item removed from cart');
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  // Apply coupon
  const applyCoupon = async (couponCode) => {
    try {
      // This would typically make an API call to validate the coupon
      // For now, we'll simulate some basic coupon logic
      const mockCoupons = {
        'SAVE10': { type: 'percentage', value: 10, minAmount: 50 },
        'FLAT20': { type: 'fixed', value: 20, minAmount: 100 },
        'WELCOME15': { type: 'percentage', value: 15, minAmount: 0 }
      };

      const coupon = mockCoupons[couponCode.toUpperCase()];
      if (!coupon) {
        toast.error('Invalid coupon code');
        return false;
      }

      const subtotal = getSubtotal();
      if (subtotal < coupon.minAmount) {
        toast.error(`Minimum order amount of $${coupon.minAmount} required for this coupon`);
        return false;
      }

      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.value) / 100;
      } else {
        discount = coupon.value;
      }

      dispatch({
        type: 'APPLY_COUPON',
        payload: { coupon: { code: couponCode, ...coupon }, discount }
      });

      toast.success(`Coupon applied! You saved $${discount.toFixed(2)}`);
      return true;
    } catch (error) {
      toast.error('Failed to apply coupon');
      return false;
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
    toast.success('Coupon removed');
  };

  // Set shipping method
  const setShipping = (shippingMethod) => {
    const shippingOptions = {
      standard: { cost: 0, estimatedDays: 5 },
      express: { cost: 9.99, estimatedDays: 2 },
      overnight: { cost: 19.99, estimatedDays: 1 }
    };

    const shipping = {
      method: shippingMethod,
      ...shippingOptions[shippingMethod]
    };

    dispatch({
      type: 'SET_SHIPPING',
      payload: shipping
    });
  };

  // Calculate subtotal
  const getSubtotal = () => {
    return state.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Calculate tax (8.5% for example)
  const getTax = () => {
    const subtotal = getSubtotal();
    const taxRate = 0.085; // 8.5%
    return subtotal * taxRate;
  };

  // Calculate total
  const getTotal = () => {
    const subtotal = getSubtotal();
    const tax = getTax();
    const shipping = state.shipping.cost;
    const discount = state.discount;
    
    return Math.max(0, subtotal + tax + shipping - discount);
  };

  // Get total items count
  const getItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Get unique products count
  const getUniqueItemsCount = () => {
    return state.items.length;
  };

  // Check if product is in cart
  const isInCart = (productId, variant = null) => {
    return state.items.some(item => 
      item.product._id === productId && 
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );
  };

  // Get item from cart
  const getCartItem = (productId, variant = null) => {
    return state.items.find(item => 
      item.product._id === productId && 
      JSON.stringify(item.variant) === JSON.stringify(variant)
    );
  };

  // Validate cart items (check stock, prices, etc.)
  const validateCart = async () => {
    // This would typically make API calls to validate each item
    // For now, we'll do basic validation
    const invalidItems = [];
    
    for (const item of state.items) {
      const availableStock = item.variant?.stock || item.product.stock;
      if (item.quantity > availableStock) {
        invalidItems.push({
          ...item,
          issue: 'insufficient_stock',
          availableStock
        });
      }
    }

    return {
      isValid: invalidItems.length === 0,
      invalidItems
    };
  };

  // Sync cart with server (for authenticated users)
  const syncCart = async () => {
    if (!isAuthenticated) return;

    try {
      // This would sync the cart with the server
      // Implementation depends on your backend API
      console.log('Syncing cart with server...');
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  };

  // Get cart summary
  const getCartSummary = () => {
    return {
      itemsCount: getItemsCount(),
      uniqueItemsCount: getUniqueItemsCount(),
      subtotal: getSubtotal(),
      tax: getTax(),
      shipping: state.shipping.cost,
      discount: state.discount,
      total: getTotal(),
      coupon: state.coupon
    };
  };

  const value = {
    // State
    ...state,
    
    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    setShipping,
    validateCart,
    syncCart,
    
    // Getters
    getSubtotal,
    getTax,
    getTotal,
    getItemsCount,
    getUniqueItemsCount,
    isInCart,
    getCartItem,
    getCartSummary
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
