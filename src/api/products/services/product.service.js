const pool = require('../../../config/database');
const { logger } = require('../../../utils/logger');

const createProduct = async ({ name, description, price, sellerId, imageUrl }) => {
  try {
    const query = `
      INSERT INTO products (name, description, price, seller_id, image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, price, seller_id, image_url, created_at, updated_at
    `;
    const result = await pool.query(query, [name, description, price, sellerId, imageUrl || null]);
    logger.info(`Product created: ${name} by seller ${sellerId}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
};

const getProducts = async () => {
  try {
    const query = `
      SELECT id, name, description, price, seller_id, image_url, created_at, updated_at
      FROM products
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    logger.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

const getProductById = async (id) => {
  try {
    const query = `
      SELECT id, name, description, price, seller_id, image_url, created_at, updated_at
      FROM products WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    if (!result.rows[0]) {
      throw new Error('Product not found');
    }
    return result.rows[0];
  } catch (error) {
    logger.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

const updateProduct = async (id, { name, description, price, imageUrl }, sellerId) => {
  try {
    const query = `
      UPDATE products
      SET name = $1, description = $2, price = $3, image_url = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND seller_id = $6
      RETURNING id, name, description, price, seller_id, image_url, created_at, updated_at
    `;
    const result = await pool.query(query, [name, description, price, imageUrl || null, id, sellerId]);
    if (!result.rows[0]) {
      throw new Error('Product not found or not authorized');
    }
    logger.info(`Product updated: ${id} by seller ${sellerId}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

const deleteProduct = async (id, sellerId) => {
  try {
    const query = `
      DELETE FROM products WHERE id = $1 AND seller_id = $2
      RETURNING id
    `;
    const result = await pool.query(query, [id, sellerId]);
    if (!result.rows[0]) {
      throw new Error('Product not found or not authorized');
    }
    logger.info(`Product deleted: ${id} by seller ${sellerId}`);
    return { id };
  } catch (error) {
    logger.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };