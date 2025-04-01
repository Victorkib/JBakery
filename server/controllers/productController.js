import Product from '../models/Product.js';
import Category from '../models/Category.js';
import InventoryLog from '../models/InventoryLog.js';
import { createError } from '../utils/errorHandler.js';
import { sendLowStockAlertEmail } from '../utils/emailService.js';

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
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
    let query = Product.find(JSON.parse(queryStr));

    // Handle search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = query.or([
        { name: searchRegex },
        { description: searchRegex },
        { ingredients: searchRegex },
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
    const total = await Product.countDocuments(query);

    query = query.skip(startIndex).limit(limit);

    // Populate category
    query = query.populate('category', 'name');

    // Executing query
    const products = await query;

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
      count: products.length,
      pagination,
      total,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'category',
      'name'
    );

    if (!product) {
      return next(
        createError(404, `Product not found with id of ${req.params.id}`)
      );
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin/Staff)
export const createProduct = async (req, res, next) => {
  try {
    // Check if category exists
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return next(createError(404, 'Category not found'));
      }
    }

    // Create product
    const product = await Product.create({
      ...req.body,
      createdBy: req.user.id,
    });

    // Log inventory creation
    await InventoryLog.create({
      product: product._id,
      previousStock: 0,
      newStock: product.stock,
      change: product.stock,
      type: 'initial',
      user: req.user.id,
      notes: 'Initial product creation',
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Staff)
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(
        createError(404, `Product not found with id of ${req.params.id}`)
      );
    }

    // Check if category exists if it's being updated
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return next(createError(404, 'Category not found'));
      }
    }

    // Check if stock is being updated
    if (req.body.stock !== undefined && req.body.stock !== product.stock) {
      // Log inventory change
      await InventoryLog.create({
        product: product._id,
        previousStock: product.stock,
        newStock: req.body.stock,
        change: req.body.stock - product.stock,
        type: 'manual',
        user: req.user.id,
        notes: req.body.notes || 'Manual stock update',
      });

      // Check if new stock is below threshold
      if (req.body.stock <= product.lowStockThreshold) {
        // Send low stock alert to admin
        const adminEmails = process.env.ADMIN_EMAILS
          ? process.env.ADMIN_EMAILS.split(',')
          : [];
        if (adminEmails.length > 0) {
          await sendLowStockAlertEmail(adminEmails[0], [
            {
              name: product.name,
              stock: req.body.stock,
              lowStockThreshold: product.lowStockThreshold,
            },
          ]);
        }
      }
    }

    // Update product
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(
        createError(404, `Product not found with id of ${req.params.id}`)
      );
    }

    // Log inventory deletion
    await InventoryLog.create({
      product: product._id,
      previousStock: product.stock,
      newStock: 0,
      change: -product.stock,
      type: 'deletion',
      user: req.user.id,
      notes: 'Product deleted',
    });

    await product.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product inventory history
// @route   GET /api/products/:id/inventory
// @access  Private (Admin/Staff)
export const getProductInventory = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(
        createError(404, `Product not found with id of ${req.params.id}`)
      );
    }

    const logs = await InventoryLog.find({ product: req.params.id })
      .sort('-createdAt')
      .populate('user', 'name');

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update products
// @route   PUT /api/products/bulk
// @access  Private (Admin)
export const bulkUpdateProducts = async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return next(createError(400, 'Products array is required'));
    }

    const results = [];
    const lowStockProducts = [];

    // Process each product update
    for (const item of products) {
      if (!item._id) {
        results.push({
          success: false,
          message: 'Product ID is required',
          data: item,
        });
        continue;
      }

      try {
        const product = await Product.findById(item._id);

        if (!product) {
          results.push({
            success: false,
            message: `Product not found with id of ${item._id}`,
            data: item,
          });
          continue;
        }

        // Check if stock is being updated
        if (item.stock !== undefined && item.stock !== product.stock) {
          // Log inventory change
          await InventoryLog.create({
            product: product._id,
            previousStock: product.stock,
            newStock: item.stock,
            change: item.stock - product.stock,
            type: 'bulk',
            user: req.user.id,
            notes: item.notes || 'Bulk stock update',
          });

          // Check if new stock is below threshold
          if (item.stock <= product.lowStockThreshold) {
            lowStockProducts.push({
              name: product.name,
              stock: item.stock,
              lowStockThreshold: product.lowStockThreshold,
            });
          }
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(item._id, item, {
          new: true,
          runValidators: true,
        });

        results.push({
          success: true,
          data: updatedProduct,
        });
      } catch (error) {
        results.push({
          success: false,
          message: error.message,
          data: item,
        });
      }
    }

    // Send low stock alert if any products are below threshold
    if (lowStockProducts.length > 0) {
      const adminEmails = process.env.ADMIN_EMAILS
        ? process.env.ADMIN_EMAILS.split(',')
        : [];
      if (adminEmails.length > 0) {
        await sendLowStockAlertEmail(adminEmails[0], lowStockProducts);
      }
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10) || 5;

    const products = await Product.find({ featured: true, status: 'active' })
      .sort('-createdAt')
      .limit(limit)
      .populate('category', 'name');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low stock products
// @route   GET /api/products/low-stock
// @access  Private (Admin/Staff)
export const getLowStockProducts = async (req, res, next) => {
  try {
    // Find products where stock is less than or equal to lowStockThreshold
    const products = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    }).populate('category', 'name');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};
