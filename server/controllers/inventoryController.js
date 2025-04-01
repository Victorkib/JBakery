import Ingredient from '../models/Ingredient.js';
import RestockLog from '../models/RestockLog.js';
import { createError } from '../utils/errorHandler.js';
import { sendLowStockAlertEmail } from '../utils/emailService.js';

// @desc    Get all ingredients
// @route   GET /api/inventory/ingredients
// @access  Private (Admin/Staff)
export const getIngredients = async (req, res, next) => {
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
    let query = Ingredient.find(JSON.parse(queryStr));

    // Handle search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = query.or([
        { name: searchRegex },
        { supplier: searchRegex },
        { category: searchRegex },
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
    const total = await Ingredient.countDocuments(query);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const ingredients = await query;

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
      count: ingredients.length,
      pagination,
      total,
      data: ingredients,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ingredient
// @route   GET /api/inventory/ingredients/:id
// @access  Private (Admin/Staff)
export const getIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return next(
        createError(404, `Ingredient not found with id of ${req.params.id}`)
      );
    }

    res.status(200).json({
      success: true,
      data: ingredient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new ingredient
// @route   POST /api/inventory/ingredients
// @access  Private (Admin/Staff)
export const createIngredient = async (req, res, next) => {
  try {
    // Create ingredient
    const ingredient = await Ingredient.create({
      ...req.body,
      createdBy: req.user.id,
    });

    // Log initial stock
    await RestockLog.create({
      ingredient: ingredient._id,
      previousStock: 0,
      newStock: ingredient.stock,
      quantity: ingredient.stock,
      cost: ingredient.cost * ingredient.stock,
      supplier: ingredient.supplier,
      user: req.user.id,
      notes: 'Initial ingredient creation',
    });

    res.status(201).json({
      success: true,
      data: ingredient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ingredient
// @route   PUT /api/inventory/ingredients/:id
// @access  Private (Admin/Staff)
export const updateIngredient = async (req, res, next) => {
  try {
    let ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return next(
        createError(404, `Ingredient not found with id of ${req.params.id}`)
      );
    }

    // Check if stock is being updated
    if (req.body.stock !== undefined && req.body.stock !== ingredient.stock) {
      // Calculate stock change
      const stockChange = req.body.stock - ingredient.stock;

      // Log stock change
      if (stockChange > 0) {
        // This is a restock
        await RestockLog.create({
          ingredient: ingredient._id,
          previousStock: ingredient.stock,
          newStock: req.body.stock,
          quantity: stockChange,
          cost: ingredient.cost * stockChange,
          supplier: ingredient.supplier,
          user: req.user.id,
          notes: req.body.notes || 'Manual stock update',
        });
      } else {
        // This is a stock reduction
        await RestockLog.create({
          ingredient: ingredient._id,
          previousStock: ingredient.stock,
          newStock: req.body.stock,
          quantity: stockChange,
          cost: 0, // No cost for reduction
          supplier: '',
          user: req.user.id,
          notes: req.body.notes || 'Manual stock reduction',
        });
      }

      // Check if new stock is below threshold
      if (req.body.stock <= ingredient.minStockLevel) {
        // Send low stock alert to admin
        const adminEmails = process.env.ADMIN_EMAILS
          ? process.env.ADMIN_EMAILS.split(',')
          : [];
        if (adminEmails.length > 0) {
          await sendLowStockAlertEmail(adminEmails[0], [
            {
              name: ingredient.name,
              stock: req.body.stock,
              lowStockThreshold: ingredient.minStockLevel,
            },
          ]);
        }
      }
    }

    // Update ingredient
    ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: ingredient,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete ingredient
// @route   DELETE /api/inventory/ingredients/:id
// @access  Private (Admin)
export const deleteIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return next(
        createError(404, `Ingredient not found with id of ${req.params.id}`)
      );
    }

    await ingredient.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Restock ingredient
// @route   POST /api/inventory/ingredients/:id/restock
// @access  Private (Admin/Staff)
export const restockIngredient = async (req, res, next) => {
  try {
    const { quantity, cost, supplier, notes } = req.body;

    if (!quantity || quantity <= 0) {
      return next(createError(400, 'Quantity must be greater than 0'));
    }

    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return next(
        createError(404, `Ingredient not found with id of ${req.params.id}`)
      );
    }

    // Update ingredient stock
    const previousStock = ingredient.stock;
    ingredient.stock += quantity;
    ingredient.lastRestocked = Date.now();

    // Update supplier if provided
    if (supplier) {
      ingredient.supplier = supplier;
    }

    // Update cost if provided
    if (cost) {
      ingredient.cost = cost;
    }

    await ingredient.save();

    // Log restock
    const restockLog = await RestockLog.create({
      ingredient: ingredient._id,
      previousStock,
      newStock: ingredient.stock,
      quantity,
      cost: cost ? cost * quantity : ingredient.cost * quantity,
      supplier: supplier || ingredient.supplier,
      user: req.user.id,
      notes: notes || 'Ingredient restock',
    });

    res.status(200).json({
      success: true,
      data: {
        ingredient,
        restockLog,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ingredient restock history
// @route   GET /api/inventory/ingredients/:id/restock-history
// @access  Private (Admin/Staff)
export const getRestockHistory = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      return next(
        createError(404, `Ingredient not found with id of ${req.params.id}`)
      );
    }

    const logs = await RestockLog.find({ ingredient: req.params.id })
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

// @desc    Get low stock ingredients
// @route   GET /api/inventory/low-stock
// @access  Private (Admin/Staff)
export const getLowStockIngredients = async (req, res, next) => {
  try {
    // Find ingredients where stock is less than or equal to minStockLevel
    const ingredients = await Ingredient.find({
      $expr: { $lte: ['$stock', '$minStockLevel'] },
    });

    res.status(200).json({
      success: true,
      count: ingredients.length,
      data: ingredients,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory statistics
// @route   GET /api/inventory/stats
// @access  Private (Admin/Staff)
export const getInventoryStats = async (req, res, next) => {
  try {
    // Get total ingredients
    const totalIngredients = await Ingredient.countDocuments();

    // Get total inventory value
    const valueResult = await Ingredient.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$stock', '$cost'] } },
        },
      },
    ]);
    const totalValue = valueResult.length > 0 ? valueResult[0].total : 0;

    // Get low stock ingredients count
    const lowStockCount = await Ingredient.countDocuments({
      $expr: { $lte: ['$stock', '$minStockLevel'] },
    });

    // Get ingredients by category
    const ingredientsByCategory = await Ingredient.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          value: { $sum: { $multiply: ['$stock', '$cost'] } },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get recent restocks
    const recentRestocks = await RestockLog.find()
      .sort('-createdAt')
      .limit(5)
      .populate('ingredient', 'name')
      .populate('user', 'name');

    res.status(200).json({
      success: true,
      data: {
        totalIngredients,
        totalValue,
        lowStockCount,
        ingredientsByCategory,
        recentRestocks,
      },
    });
  } catch (error) {
    next(error);
  }
};
