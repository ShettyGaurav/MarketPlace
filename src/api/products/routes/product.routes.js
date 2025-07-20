const express = require('express');
const { authenticate, authorize } = require('../../auth/middlewares/auth.middleware.js');
const {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} = require('../controllers/product.controller');
const router = express.Router();

router.get('/', getProductsController);
router.get('/:id', getProductByIdController);
router.post('/', authenticate, authorize(['SELLER']), createProductController);
router.put('/:id', authenticate, authorize(['SELLER']), updateProductController);
router.delete('/:id', authenticate, authorize(['SELLER']), deleteProductController);

module.exports = router;