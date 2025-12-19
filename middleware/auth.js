const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret', {
    expiresIn: '30d'
  });
};

// Verify JWT token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (user.isLocked) {
      return res.status(423).json({ 
        success: false, 
        message: 'Account is temporarily locked' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

// Optional authentication (for public routes that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId).select('-password');
      if (user && !user.isLocked) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Admin only middleware
const adminOnly = authorize('admin');

// Seller or admin middleware
const sellerOrAdmin = authorize('seller', 'admin');

// User ownership verification
const verifyOwnership = (resourceField = 'user') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const Model = req.Model; // Should be set by route handler
      
      if (!Model) {
        return res.status(500).json({ 
          success: false, 
          message: 'Model not specified for ownership verification' 
        });
      }

      const resource = await Model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ 
          success: false, 
          message: 'Resource not found' 
        });
      }

      // Admin can access everything
      if (req.user.role === 'admin') {
        req.resource = resource;
        return next();
      }

      // Check ownership
      const ownerId = resource[resourceField];
      if (!ownerId || ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied' 
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Ownership verification error' 
      });
    }
  };
};

// Rate limiting for sensitive operations
const sensitiveOperationLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const key = `${req.ip}-${req.user ? req.user._id : 'anonymous'}`;
    const now = Date.now();
    
    if (!attempts.has(key)) {
      attempts.set(key, []);
    }
    
    const userAttempts = attempts.get(key);
    
    // Remove old attempts outside the window
    const validAttempts = userAttempts.filter(timestamp => now - timestamp < windowMs);
    attempts.set(key, validAttempts);
    
    if (validAttempts.length >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many attempts. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    validAttempts.push(now);
    next();
  };
};

// Two-factor authentication middleware
const requireTwoFactor = async (req, res, next) => {
  if (!req.user.twoFactorEnabled) {
    return next();
  }

  const twoFactorToken = req.headers['x-2fa-token'];
  
  if (!twoFactorToken) {
    return res.status(401).json({
      success: false,
      message: 'Two-factor authentication required',
      requiresTwoFactor: true
    });
  }

  // Verify 2FA token (implementation depends on your 2FA method)
  // This is a placeholder - implement actual 2FA verification
  const isValidToken = await verifyTwoFactorToken(req.user, twoFactorToken);
  
  if (!isValidToken) {
    return res.status(401).json({
      success: false,
      message: 'Invalid two-factor authentication token'
    });
  }

  next();
};

// Placeholder for 2FA token verification
const verifyTwoFactorToken = async (user, token) => {
  // Implement your 2FA verification logic here
  // This could be TOTP, SMS, email, etc.
  return true; // Placeholder
};

module.exports = {
  generateToken,
  generateRefreshToken,
  authenticateToken,
  optionalAuth,
  authorize,
  adminOnly,
  sellerOrAdmin,
  verifyOwnership,
  sensitiveOperationLimit,
  requireTwoFactor
};