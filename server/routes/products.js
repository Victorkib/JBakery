import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductInventory,
  bulkUpdateProducts,
  getFeaturedProducts,
  getLowStockProducts,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Protected routes
router.use(protect);

// Admin/Staff routes
router.post('/', authorize('admin', 'staff'), createProduct);
router.put('/:id', authorize('admin', 'staff'), updateProduct);
router.get('/:id/inventory', authorize('admin', 'staff'), getProductInventory);
router.get(
  '/inventory/low-stock',
  authorize('admin', 'staff'),
  getLowStockProducts
);
router.put('/bulk', authorize('admin'), bulkUpdateProducts);

// Admin only routes
router.delete('/:id', authorize('admin'), deleteProduct);

export default router;
