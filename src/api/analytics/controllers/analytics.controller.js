const { getTotalSales, getOrderStats, getTopProducts, getSalesOverTime } = require('../services/analytics.service');
const { logger } = require('../../../utils/logger');

const getTotalSalesController = async (req, res, next) => {
  try {
    const data = await getTotalSales();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getOrderStatsController = async (req, res, next) => {
  try {
    const data = await getOrderStats();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getTopProductsController = async (req, res, next) => {
  try {
    const { limit } = req.query;
    const data = await getTopProducts(parseInt(limit) || 5);
    res.json({ products: data });
  } catch (error) {
    next(error);
  }
};

const getSalesOverTimeController = async (req, res, next) => {
  try {
    const { interval } = req.query; // day, week, month
    const data = await getSalesOverTime(interval);
    res.json({ sales: data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTotalSalesController,
  getOrderStatsController,
  getTopProductsController,
  getSalesOverTimeController,
};