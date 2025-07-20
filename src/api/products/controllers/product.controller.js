const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../services/product.service');
const { logger } = require('../../../utils/logger.js');

const createProductController = async (req, res, next) => {
  try {
    const { name, description, price, imageUrl } = req.body;
    const sellerId = req.user.id; // From JWT
    const product = await createProduct({ name, description, price, sellerId, imageUrl });
    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
};

const getProductsController = async (req, res, next) => {
  try {
    const products = await getProducts();
    res.json({ products });
  } catch (error) {
    next(error);
  }
};

const getProductByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    res.json({ product });
  } catch (error) {
    next(error);
  }
};

const updateProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl } = req.body;
    const sellerId = req.user.id; // From JWT
    const product = await updateProduct(id, { name, description, price, imageUrl }, sellerId);
    res.json({ product });
  } catch (error) {
    next(error);
  }
};

const deleteProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id; // From JWT
    const result = await deleteProduct(id, sellerId);
    res.json({ message: 'Product deleted', id: result.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProductController,
  getProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
};