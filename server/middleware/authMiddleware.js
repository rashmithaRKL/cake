const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const { logger } = require('../config/db');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookie
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User no longer exists'
        });
      }

      // Check if user changed password after token was issued
      if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
        return res.status(401).json({
          success: false,
          error: 'User recently changed password. Please log in again'
        });
      }

      // Add user to req object
      req.user = user;
      next();
    } catch (err) {
      logger.error(`JWT Verification Error: ${err.message}`);
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  } catch (err) {
    logger.error(`Auth Middleware Error: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Verify email middleware
exports.verifyEmail = async (req, res, next) => {
  try {
    if (!req.user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        error: 'Please verify your email address first'
      });
    }
    next();
  } catch (err) {
    logger.error(`Email Verification Middleware Error: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Rate limiting middleware
exports.rateLimit = (limit, timeWindow) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    // Clean up old requests
    if (requests.has(ip)) {
      const userRequests = requests.get(ip);
      const validRequests = userRequests.filter(
        timestamp => now - timestamp < timeWindow
      );
      
      if (validRequests.length >= limit) {
        return res.status(429).json({
          success: false,
          error: 'Too many requests, please try again later'
        });
      }

      validRequests.push(now);
      requests.set(ip, validRequests);
    } else {
      requests.set(ip, [now]);
    }

    next();
  };
};

// Activity logging middleware
exports.logActivity = (activityType) => {
  return async (req, res, next) => {
    try {
      const originalSend = res.send;
      res.send = function (data) {
        // Log the activity only if the request was successful
        if (res.statusCode >= 200 && res.statusCode < 300) {
          logger.info({
            activityType,
            userId: req.user?._id,
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            timestamp: new Date()
          });
        }
        originalSend.call(this, data);
      };
      next();
    } catch (err) {
      logger.error(`Activity Logging Middleware Error: ${err.message}`);
      next();
    }
  };
};

// Sanitize request data middleware
exports.sanitizeData = (req, res, next) => {
  try {
    // Sanitize request body
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          // Remove any HTML tags
          req.body[key] = req.body[key].replace(/<[^>]*>/g, '');
          // Trim whitespace
          req.body[key] = req.body[key].trim();
        }
      });
    }

    // Sanitize request query parameters
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        if (typeof req.query[key] === 'string') {
          req.query[key] = req.query[key].replace(/<[^>]*>/g, '');
          req.query[key] = req.query[key].trim();
        }
      });
    }

    next();
  } catch (err) {
    logger.error(`Data Sanitization Middleware Error: ${err.message}`);
    next();
  }
};

// Error handling middleware
exports.errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value entered'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};