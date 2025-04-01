import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import InventoryLog from '../models/InventoryLog.js';

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin/Staff)
export const getDashboardStats = async (req, res, next) => {
  try {
    // Get date range
    const { period } = req.query;
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        // Default to 30 days
        startDate.setDate(startDate.getDate() - 30);
    }

    // Get total sales
    const salesResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;
    const orderCount = salesResult.length > 0 ? salesResult[0].orderCount : 0;

    // Get new customers
    const newCustomers = await User.countDocuments({
      createdAt: { $gte: startDate },
      role: 'customer',
    });

    // Get top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'Cancelled' },
        },
      },
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

    // Get sales by day
    const salesByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get low stock products count
    const lowStockCount = await Product.countDocuments({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    });

    // Get pending orders count
    const pendingOrders = await Order.countDocuments({
      status: 'Pending',
    });

    res.status(200).json({
      success: true,
      data: {
        totalSales,
        orderCount,
        newCustomers,
        topProducts,
        salesByDay,
        lowStockCount,
        pendingOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private (Admin/Staff)
export const getSalesAnalytics = async (req, res, next) => {
  try {
    // Get date range
    const { startDate, endDate } = req.query;
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate) : new Date();

    // Ensure end date is set to end of day
    end.setHours(23, 59, 59, 999);

    // Get sales by day
    const salesByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get sales by payment method
    const salesByPaymentMethod = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: '$paymentMethod',
          sales: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { sales: -1 },
      },
    ]);

    // Get sales by order type
    const salesByOrderType = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: '$type',
          sales: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Get average order value
    const avgOrderValue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: null,
          avgValue: { $avg: '$totalAmount' },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        salesByDay,
        salesByPaymentMethod,
        salesByOrderType,
        avgOrderValue:
          avgOrderValue.length > 0
            ? avgOrderValue[0]
            : { avgValue: 0, totalSales: 0, orderCount: 0 },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product analytics
// @route   GET /api/analytics/products
// @access  Private (Admin/Staff)
export const getProductAnalytics = async (req, res, next) => {
  try {
    // Get date range
    const { period } = req.query;
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        // Default to 30 days
        startDate.setDate(startDate.getDate() - 30);
    }

    // Get top selling products
    const topSellingProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'Cancelled' },
        },
      },
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
        $limit: 10,
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
          category: '$product.category',
          totalSold: 1,
          revenue: 1,
        },
      },
    ]);

    // Get sales by category
    const salesByCategory = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'Cancelled' },
        },
      },
      {
        $unwind: '$items',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $group: {
          _id: '$category._id',
          categoryName: { $first: '$category.name' },
          sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          quantity: { $sum: '$items.quantity' },
        },
      },
      {
        $sort: { sales: -1 },
      },
    ]);

    // Get inventory movement
    const inventoryMovement = await InventoryLog.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalChange: { $sum: '$change' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get product stock distribution
    const stockDistribution = await Product.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $eq: ['$stock', 0] }, then: 'Out of Stock' },
                {
                  case: { $lte: ['$stock', '$lowStockThreshold'] },
                  then: 'Low Stock',
                },
                { case: { $lte: ['$stock', 20] }, then: '1-20' },
                { case: { $lte: ['$stock', 50] }, then: '21-50' },
                { case: { $lte: ['$stock', 100] }, then: '51-100' },
              ],
              default: '100+',
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        topSellingProducts,
        salesByCategory,
        inventoryMovement,
        stockDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer analytics
// @route   GET /api/analytics/customers
// @access  Private (Admin/Staff)
export const getCustomerAnalytics = async (req, res, next) => {
  try {
    // Get date range
    const { period } = req.query;
    const startDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        // Default to 30 days
        startDate.setDate(startDate.getDate() - 30);
    }

    // Get new customers over time
    const newCustomers = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          role: 'customer',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get top customers by spending
    const topCustomers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { totalSpent: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          name: '$user.name',
          email: '$user.email',
          totalSpent: 1,
          orderCount: 1,
          avgOrderValue: { $divide: ['$totalSpent', '$orderCount'] },
        },
      },
    ]);

    // Get customer order frequency
    const orderFrequency = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: '$user',
          orderCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$orderCount',
          customerCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Get customer retention rate
    const totalCustomers = await User.countDocuments({
      role: 'customer',
      createdAt: { $lt: startDate },
    });

    const activeCustomers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: '$user',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $match: {
          'user.createdAt': { $lt: startDate },
        },
      },
      {
        $count: 'activeCount',
      },
    ]);

    const retentionRate =
      totalCustomers > 0 && activeCustomers.length > 0
        ? (activeCustomers[0].activeCount / totalCustomers) * 100
        : 0;

    res.status(200).json({
      success: true,
      data: {
        newCustomers,
        topCustomers,
        orderFrequency,
        retentionRate,
        totalCustomers,
        activeCustomersCount:
          activeCustomers.length > 0 ? activeCustomers[0].activeCount : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
