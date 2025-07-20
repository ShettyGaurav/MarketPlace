const pool = require('../../../config/database');
const { logger } = require('../../../utils/logger');

const createOrder = async ({ buyerId, productId }) => {
  try {
    // Validate product exists
    const productQuery = 'SELECT id FROM products WHERE id = $1';
    const productResult = await pool.query(productQuery, [productId]);
    if (!productResult.rows[0]) {
      throw new Error('Product not found');
    }

    const query = `
      INSERT INTO orders (buyer_id, product_id, status)
      VALUES ($1, $2, 'PENDING')
      RETURNING id, buyer_id, product_id, status, created_at, updated_at
    `;
    const result = await pool.query(query, [buyerId, productId]);
    logger.info(`Order created: ${result.rows[0].id} for buyer ${buyerId}`);
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating order:', error);
    throw error;
  }
};

const cancelOrder = async (orderId, buyerId) => {
  try {
    const query = `
      UPDATE orders
      SET status = 'CANCELED', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND buyer_id = $2 AND status = 'PENDING'
      RETURNING id, buyer_id, product_id, status, created_at, updated_at
    `;
    const result = await pool.query(query, [orderId, buyerId]);
    if (!result.rows[0]) {
      throw new Error('Order not found, not owned, or not cancellable');
    }
    logger.info(`Order canceled: ${orderId} by buyer ${buyerId}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error canceling order ${orderId}:`, error);
    throw error;
  }
};

const getOrders = async (userId, role) => {
  try {
    let query;
    let params;
    if (role === 'ADMIN') {
      query = `
        SELECT id, buyer_id, product_id, status, created_at, updated_at
        FROM orders
      `;
      params = [];
    } else {
      query = `
        SELECT id, buyer_id, product_id, status, created_at, updated_at
        FROM orders WHERE buyer_id = $1
      `;
      params = [userId];
    }
    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

const getOrderById = async (orderId, userId, role) => {
  try {
    let query;
    let params;
    if (role === 'ADMIN') {
      query = `
        SELECT id, buyer_id, product_id, status, created_at, updated_at
        FROM orders WHERE id = $1
      `;
      params = [orderId];
    } else {
      query = `
        SELECT id, buyer_id, product_id, status, created_at, updated_at
        FROM orders WHERE id = $1 AND buyer_id = $2
      `;
      params = [orderId, userId];
    }
    const result = await pool.query(query, params);
    if (!result.rows[0]) {
      throw new Error('Order not found or not authorized');
    }
    return result.rows[0];
  } catch (error) {
    logger.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

module.exports = { createOrder, cancelOrder, getOrders, getOrderById };