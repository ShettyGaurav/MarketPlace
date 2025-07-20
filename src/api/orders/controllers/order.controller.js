const { createOrder, cancelOrder, getOrders, getOrderById } = require('../services/order.service');
const { logger } = require('../../../utils/logger');

const createOrderController = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const buyerId = req.user.id; // From JWT
    const order = await createOrder({ buyerId, productId });
    res.status(201).json({ order });
  }
  catch (error) {
    next(error);
  }
};

const cancelOrderController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const buyerId = req.user.id; // From JWT
    const order = await cancelOrder(id, buyerId);
    res.json({ order });
  } catch (error) {
    next(error);
  }
};

const getOrdersController = async (req, res, next) => {
  try {
    const { id, role } = req.user; // From JWT
    const orders = await getOrders(id, role);
    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

const getOrderByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user; // From JWT
    const order = await getOrderById(id, userId, role);
    res.json({ order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrderController,
  cancelOrderController,
  getOrdersController,
  getOrderByIdController,
};