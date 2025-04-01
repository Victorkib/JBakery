import Order from '../models/Order.js';
import Product from '../models/Product.js';
import InventoryLog from '../models/InventoryLog.js';
import { createError } from '../utils/errorHandler.js';
import {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
} from '../utils/emailService.js';

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin/Staff)
export const getOrders = async (req, res, next) => {
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
    let query = Order.find(JSON.parse(queryStr));

    // Handle search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = query.or([
        { orderNumber: searchRegex },
        { 'user.name': searchRegex },
        { 'user.email': searchRegex },
        { 'shippingAddress.address': searchRegex },
      ]);
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
    const total = await Order.countDocuments(query);

    query = query.skip(startIndex).limit(limit);

    // Populate user and products
    query = query
      .populate({
        path: 'user',
        select: 'name email',
      })
      .populate({
        path: 'items.product',
        select: 'name price image',
      });

    // Executing query
    const orders = await query;

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
      count: orders.length,
      pagination,
      total,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email',
      })
      .populate({
        path: 'items.product',
        select: 'name price image description',
      });

    if (!order) {
      return next(
        createError(404, `Order not found with id of ${req.params.id}`)
      );
    }

    // Check if user is authorized to view this order
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'staff' &&
      order.user._id.toString() !== req.user.id
    ) {
      return next(createError(403, 'Not authorized to access this order'));
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Generate order number
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}${orderCount}`;
    req.body.orderNumber = orderNumber;

    // Validate and calculate order total
    let totalAmount = 0;
    const items = [];

    // Check if items exist
    if (
      !req.body.items ||
      !Array.isArray(req.body.items) ||
      req.body.items.length === 0
    ) {
      return next(createError(400, 'Order must include at least one item'));
    }

    // Process each item
    for (const item of req.body.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return next(
          createError(404, `Product not found with id of ${item.product}`)
        );
      }

      // Check if product is active
      if (product.status !== 'active') {
        return next(
          createError(400, `Product ${product.name} is not available`)
        );
      }

      // Check if enough stock
      if (product.stock < item.quantity) {
        return next(createError(400, `Insufficient stock for ${product.name}`));
      }

      // Calculate item price
      const itemPrice = product.price;
      const itemTotal = itemPrice * item.quantity;

      // Add to total
      totalAmount += itemTotal;

      // Add to items array
      items.push({
        product: product._id,
        quantity: item.quantity,
        price: itemPrice,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();

      // Log inventory change
      await InventoryLog.create({
        product: product._id,
        previousStock: product.stock + item.quantity,
        newStock: product.stock,
        change: -item.quantity,
        type: 'order',
        user: req.user.id,
        notes: `Order ${orderNumber}`,
      });
    }

    // Create order with calculated total
    const order = await Order.create({
      ...req.body,
      items,
      totalAmount,
    });

    // Populate user and products for email
    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: 'user',
        select: 'name email',
      })
      .populate({
        path: 'items.product',
        select: 'name price image',
      });

    // Send order confirmation email
    await sendOrderConfirmationEmail(req.user.email, populatedOrder);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Staff)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return next(createError(400, 'Status is required'));
    }

    // Valid statuses
    const validStatuses = [
      'Pending',
      'Processing',
      'Ready',
      'Completed',
      'Cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return next(createError(400, 'Invalid status'));
    }

    const order = await Order.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email',
      })
      .populate({
        path: 'items.product',
        select: 'name price image',
      });

    if (!order) {
      return next(
        createError(404, `Order not found with id of ${req.params.id}`)
      );
    }

    // Handle cancellation - restore stock
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      // Restore stock for each item
      for (const item of order.items) {
        const product = await Product.findById(item.product);

        if (product) {
          product.stock += item.quantity;
          await product.save();

          // Log inventory change
          await InventoryLog.create({
            product: product._id,
            previousStock: product.stock - item.quantity,
            newStock: product.stock,
            change: item.quantity,
            type: 'order-cancel',
            user: req.user.id,
            notes: `Order ${order.orderNumber} cancelled`,
          });
        }
      }
    }

    // Update order status
    order.status = status;
    order.updatedBy = req.user.id;
    await order.save();

    // Send status update email
    await sendOrderStatusUpdateEmail(order.user.email, order);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
// export const updateOrderToPaid = async (req, res, next) => {
//   try {
//     const { paymentResult } = req.body

//     const order = await Order.findById(req.params.id)

//     if (!order) {
//       return next(createError(404, "Order not found"))
//     }

//     // Verify it's the user's order or admin/staff
//     if (req.user.role !== "admin" && req.user.role !== "staff" && order.user.toString() !== req.user._id.toString()) {
//       return next(createError(403, "Not authorized to update this order"))
//     }

//     // Update payment info
//     order.isPaid = true
//     order.paidAt = Date.now()
//     order.paymentResult = paymentResult

//     const updatedOrder = await order.save()

//     res.status(200).json({
//       success: true,
//       data: updatedOrder,
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
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

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private (Admin/Staff)
export const getOrderStats = async (req, res, next) => {
  try {
    // Get total orders
    const totalOrders = await Order.countDocuments();

    // Get total revenue
    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get orders by date (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const ordersByDate = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      {
        $unwind: '$items',
      },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $project: {
          _id: 1,
          name: '$product.name',
          image: '$product.image',
          totalSold: 1,
          revenue: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        ordersByStatus,
        ordersByDate,
        topProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(createError(404, 'Order not found'));
    }

    // Check permissions
    if (
      req.user.role !== 'admin' &&
      req.user.role !== 'staff' &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return next(createError(403, 'Not authorized to cancel this order'));
    }

    // Check if order can be cancelled
    if (order.status === 'Completed' || order.status === 'Cancelled') {
      return next(
        createError(
          400,
          `Order cannot be cancelled because it is already ${order.status.toLowerCase()}`
        )
      );
    }

    // Update order status
    order.status = 'Cancelled';

    // Return items to inventory
    // for (const item of order.orderItems) {
    //   const product = await Product.findById(item.product)
    //   if (product) {
    //     product.stock += item.quantity
    //     product.sales -= item.quantity

    //     // Update product status based on stock level
    //     if (product.stock > 0) {
    //       if (product.stock <= product.lowStockThreshold) {
    //         product.status = "low_stock"
    //       } else {
    //         product.status = "active"
    //       }
    //     }

    //     await product.save()
    //   }
    // }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
