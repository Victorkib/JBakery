import express from 'express';
import {
  getIngredients,
  getIngredient,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  restockIngredient,
  getRestockHistory,
  getLowStockIngredients,
  getInventoryStats,
} from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Admin/Staff routes
router
  .route('/ingredients')
  .get(authorize('admin', 'staff'), getIngredients)
  .post(authorize('admin', 'staff'), createIngredient);

router
  .route('/ingredients/:id')
  .get(authorize('admin', 'staff'), getIngredient)
  .put(authorize('admin', 'staff'), updateIngredient);

router.post(
  '/ingredients/:id/restock',
  authorize('admin', 'staff'),
  restockIngredient
);
router.get(
  '/ingredients/:id/restock-history',
  authorize('admin', 'staff'),
  getRestockHistory
);
router.get('/low-stock', authorize('admin', 'staff'), getLowStockIngredients);
router.get('/stats', authorize('admin', 'staff'), getInventoryStats);

// Admin only routes
router.delete('/ingredients/:id', authorize('admin'), deleteIngredient);

export default router;
