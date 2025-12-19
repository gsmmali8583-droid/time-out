import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.payload.items || [],
        loading: false
      };
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.product._id !== action.payload.productId)
      };
    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: []
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  loading: true
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const wishlistData = JSON.parse(savedWishlist);
        dispatch({ type: 'LOAD_WISHLIST', payload: wishlistData });
      } catch (error) {
        console.error('Error loading wishlist:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem('wishlist', JSON.stringify({ items: state.items }));
    }
  }, [state.items, state.loading]);

  const addToWishlist = (product) => {
    const existingItem = state.items.find(item => item.product._id === product._id);
    if (existingItem) {
      toast.error('Item already in wishlist');
      return false;
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product._id,
        product,
        addedAt: new Date().toISOString()
      }
    });

    toast.success('Added to wishlist');
    return true;
  };

  const removeFromWishlist = (productId) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { productId }
    });
    toast.success('Removed from wishlist');
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
    toast.success('Wishlist cleared');
  };

  const isInWishlist = (productId) => {
    return state.items.some(item => item.product._id === productId);
  };

  const getItemsCount = () => {
    return state.items.length;
  };

  const value = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getItemsCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
