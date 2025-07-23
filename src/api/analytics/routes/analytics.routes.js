const express = require('express');
const { authenticate, authorize } = require('../../auth/middlewares/auth.middleware');
const {
  getTotalSalesController,
  getOrderStatsController,
  getTopProductsController,
  getSalesOverTimeController,
} = require('../controllers/analytics.controller');
const router = express.Router();

router.get('/sales', authenticate, authorize(['ADMIN']), getTotalSalesController);
router.get('/orders', authenticate, authorize(['ADMIN']), getOrderStatsController);
router.get('/top-products', authenticate, authorize(['ADMIN']), getTopProductsController);
router.get('/sales-over-time', authenticate, authorize(['ADMIN']), getSalesOverTimeController);

module.exports = router;