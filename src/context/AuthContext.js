import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import Cookies from 'js-cookie';
import { authAPI } from '../services/api';

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const queryClient = useQueryClient();

  // Check for existing token on mount
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      // Verify token and get user data
      authAPI.getProfile()
        .then(response => {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data.user,
              token
            }
          });
        })
        .catch(() => {
          // Token is invalid, remove it
          Cookies.remove('token');
          Cookies.remove('refreshToken');
          dispatch({ type: 'LOGOUT' });
        });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await authAPI.login(credentials);
      const { user, token, refreshToken } = response.data;

      // Store tokens in cookies
      Cookies.set('token', token, { 
        expires: credentials.rememberMe ? 30 : 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, { 
          expires: 30,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await authAPI.register(userData);
      const { user, token, refreshToken } = response.data;

      // Store tokens in cookies
      Cookies.set('token', token, { 
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, { 
          expires: 30,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API if needed
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear tokens and state regardless of API call result
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      
      // Clear all cached data
      queryClient.clear();
      
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      const updatedUser = response.data.user;
      
      dispatch({
        type: 'UPDATE_USER',
        payload: updatedUser
      });

      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      return { success: false, error: errorMessage };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      await authAPI.forgotPassword({ email });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset request failed';
      return { success: false, error: errorMessage };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      await authAPI.resetPassword(token, { password });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      return { success: false, error: errorMessage };
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      await authAPI.verifyEmail(token);
      
      // Update user verification status
      dispatch({
        type: 'UPDATE_USER',
        payload: { isVerified: true }
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Email verification failed';
      return { success: false, error: errorMessage };
    }
  };

  // Resend verification email
  const resendVerification = async () => {
    try {
      await authAPI.resendVerification();
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend verification email';
      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role);
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Check if user is seller
  const isSeller = () => {
    return hasRole('seller');
  };

  // Get user's full name
  const getFullName = () => {
    if (!state.user) return '';
    return `${state.user.firstName} ${state.user.lastName}`;
  };

  // Get user's initials
  const getInitials = () => {
    if (!state.user) return '';
    return `${state.user.firstName?.[0] || ''}${state.user.lastName?.[0] || ''}`.toUpperCase();
  };

  const value = {
    // State
    ...state,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    clearError,
    
    // Utility functions
    hasRole,
    hasAnyRole,
    isAdmin,
    isSeller,
    getFullName,
    getInitials
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
