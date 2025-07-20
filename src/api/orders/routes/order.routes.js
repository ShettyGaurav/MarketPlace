const express = require('express');
const { authenticate, authorize } = require('../../auth/middlewares/auth.middleware');
const {
  createOrderController,
  cancelOrderController,
  getOrdersController,
  getOrderByIdController,
} = require('../controllers/order.controller');
const router = express.Router();

router.post('/', authenticate, authorize(['USER', 'ADMIN']), createOrderController);
router.delete('/:id', authenticate, authorize(['USER', 'ADMIN']), cancelOrderController);
router.get('/', authenticate, authorize(['USER', 'ADMIN']), getOrdersController);
router.get('/:id', authenticate, authorize(['USER', 'ADMIN']), getOrderByIdController);

module.exports = router;