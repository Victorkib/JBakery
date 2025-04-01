import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  getMyOrders,
  getOrderStats,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Customer routes
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);

// Admin/Staff routes
router.get('/', authorize('admin', 'staff'), getOrders);
router.get('/stats', authorize('admin', 'staff'), getOrderStats);
router.put('/:id/status', authorize('admin', 'staff'), updateOrderStatus);

// All authenticated users can view an order (with authorization check in controller)
router.get('/:id', getOrder);

export default router;
