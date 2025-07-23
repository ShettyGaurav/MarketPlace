const pool = require('../../../config/database');
const { logger } = require('../../../utils/logger');

const getTotalSales = async () => {
  try {
    const query = `
      SELECT COALESCE(SUM(p.price), 0) as total_sales
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.status = 'PENDING'
    `;
    const result = await pool.query(query);
    logger.info('Fetched total sales');
    return { totalSales: parseFloat(result.rows[0].total_sales) };
  } catch (error) {
    logger.error('Error fetching total sales:', error);
    throw new Error('Failed to fetch total sales');
  }
};

const getOrderStats = async () => {
  try {
    const query = `
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
    `;
    const result = await pool.query(query);
    logger.info('Fetched order stats');
    return result.rows.reduce((acc, row) => {
      acc[row.status] = parseInt(row.count);
      return acc;
    }, {});
  } catch (error) {
    logger.error('Error fetching order stats:', error);
    throw new Error('Failed to fetch order stats');
  }
};

const getTopProducts = async (limit = 5) => {
  try {
    const query = `
      SELECT p.id, p.name, p.price, COUNT(o.id) as order_count
      FROM products p
      LEFT JOIN orders o ON p.id = o.product_id
      GROUP BY p.id, p.name, p.price
      ORDER BY order_count DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    logger.info('Fetched top products');
    return result.rows;
  } catch (error) {
    logger.error('Error fetching top products:', error);
    throw new Error('Failed to fetch top products');
  }
};

const getSalesOverTime = async (interval = 'day') => {
  try {
    const intervalMap = {
      day: 'YYYY-MM-DD',
      week: 'YYYY-WW',
      month: 'YYYY-MM',
    };
    const format = intervalMap[interval] || 'YYYY-MM-DD';
    const query = `
      SELECT TO_CHAR(o.created_at, $1) as period,
             COALESCE(SUM(p.price), 0) as sales
      FROM orders o
      JOIN products p ON o.product_id = p.id
      WHERE o.status = 'PENDING'
      GROUP BY TO_CHAR(o.created_at, $1)
      ORDER BY period
    `;
    const result = await pool.query(query, [format]);
    logger.info(`Fetched sales over time (${interval})`);
    return result.rows.map(row => ({
      period: row.period,
      sales: parseFloat(row.sales),
    }));
  } catch (error) {
    logger.error(`Error fetching sales over time (${interval}):`, error);
    throw new Error('Failed to fetch sales over time');
  }
};

module.exports = { getTotalSales, getOrderStats, getTopProducts, getSalesOverTime };