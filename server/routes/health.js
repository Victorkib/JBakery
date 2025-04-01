import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// @desc    Health check endpoint
// @route   GET /api/health
// @access  Public
router.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  };

  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      healthcheck.database = 'Connected';
    } else {
      healthcheck.database = 'Disconnected';
      healthcheck.message = 'Database connection issue';
    }

    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = error.message;
    res.status(503).json(healthcheck);
  }
});

export default router;
