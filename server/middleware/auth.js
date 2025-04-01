import jwt from 'jsonwebtoken';
import { createError } from '../utils/errorHandler.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.authToken) {
      // Get token from cookie
      token = req.cookies.authToken;
    }

    // Check if token exists
    if (!token) {
      return next(createError(401, 'Not authorized to access this route'));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(createError(401, 'User not found'));
      }

      // Check if user is active
      if (!user.isActive) {
        return next(createError(401, 'User account is deactivated'));
      }

      // Add user to request
      req.user = user;
      next();
    } catch (error) {
      return next(createError(401, 'Not authorized to access this route'));
    }
  } catch (error) {
    next(error);
  }
};

// Restrict to certain roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(401, 'Not authorized to access this route'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        createError(
          403,
          `User role ${req.user.role} is not authorized to access this route`
        )
      );
    }

    next();
  };
};

// Track user activity
export const trackActivity = async (req, res, next) => {
  // Skip tracking for static files, health checks, and OPTIONS requests
  if (
    req.method === 'OPTIONS' ||
    req.url.startsWith('/public') ||
    req.url === '/api/health'
  ) {
    return next();
  }

  // Continue processing the request
  next();

  // Track activity after response is sent (don't block the request)
  try {
    // Only track activity for authenticated users
    if (req.user && req.user._id) {
      const activity = {
        user: req.user._id,
        action: req.method,
        route: req.originalUrl || req.url,
        ipAddress:
          req.ip ||
          req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress,
        userAgent: req.headers['user-agent'] || 'Unknown',
        timestamp: new Date(),
      };

      // Save activity asynchronously
      await Activity.create(activity);
    }
  } catch (error) {
    console.error('Error tracking activity:', error);
    // Don't throw error to client, just log it
  }
};

// Check if user is authenticated but don't require it
export const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.authToken) {
      token = req.cookies.authToken;
    }

    // If no token, continue as unauthenticated
    if (!token) {
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next();
      }

      // Check if user is active
      if (!user.isActive) {
        return next();
      }

      // Add user to request
      req.user = user;
      next();
    } catch (error) {
      // Continue as unauthenticated if token is invalid
      return next();
    }
  } catch (error) {
    // Continue as unauthenticated if any error occurs
    return next();
  }
};
