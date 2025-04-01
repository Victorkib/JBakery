import User from '../models/User.js';
import Order from '../models/Order.js';
import { createError } from '../utils/errorHandler.js';
import {
  sendWelcomeEmail,
  sendCustomNotificationEmail,
} from '../utils/emailService.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req, res, next) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

    // Remove fields from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    let query = User.find(JSON.parse(queryStr));

    // Handle search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = query.or([{ name: searchRegex }, { email: searchRegex }]);
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await User.countDocuments(query);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const users = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: users.length,
      pagination,
      total,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        createError(404, `User not found with id of ${req.params.id}`)
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private (Admin)
export const createUser = async (req, res, next) => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return next(createError(400, 'User already exists'));
    }

    // Create user
    const user = await User.create(req.body);

    // Send welcome email
    if (user.email) {
      await sendWelcomeEmail(user.email, user.name);
    }

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res, next) => {
  try {
    // Remove password field if it exists
    if (req.body.password) {
      delete req.body.password;
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(
        createError(404, `User not found with id of ${req.params.id}`)
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        createError(404, `User not found with id of ${req.params.id}`)
      );
    }

    // Check if user has orders
    const orders = await Order.countDocuments({ user: req.params.id });
    if (orders > 0) {
      return next(
        createError(
          400,
          'Cannot delete user with orders. Consider deactivating instead.'
        )
      );
    }

    await user.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/users/:id/orders
// @access  Private (Admin)
export const getUserOrders = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        createError(404, `User not found with id of ${req.params.id}`)
      );
    }

    const orders = await Order.find({ user: req.params.id })
      .sort('-createdAt')
      .populate({
        path: 'items.product',
        select: 'name price image',
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send notification to user
// @route   POST /api/users/:id/notify
// @access  Private (Admin)
export const notifyUser = async (req, res, next) => {
  try {
    const { title, message, buttonText, buttonLink } = req.body;

    if (!title || !message) {
      return next(createError(400, 'Title and message are required'));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        createError(404, `User not found with id of ${req.params.id}`)
      );
    }

    // Send notification email
    await sendCustomNotificationEmail(
      user.email,
      title,
      message,
      buttonText,
      buttonLink
    );

    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
    });
  } catch (error) {
    next(error);
  }
};
