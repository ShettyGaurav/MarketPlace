const pool = require('../../../config/database');
const { logger } = require('../../../utils/logger');

const updateProductImage = async (productId, sellerId, imageUrl) => {
  try {
    const query = `
      UPDATE products
      SET image_url = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND seller_id = $3
      RETURNING id, image_url
    `;
    const result = await pool.query(query, [imageUrl, productId, sellerId]);
    if (!result.rows[0]) {
      throw new Error('Product not found or not authorized');
    }
    logger.info(`Product ${productId} image updated by seller ${sellerId}`);
    return result.rows[0];
  } catch (error) {
    logger.error(`Error updating product ${productId} image:`, error);
    throw error;
  }
};

module.exports = { updateProductImage };