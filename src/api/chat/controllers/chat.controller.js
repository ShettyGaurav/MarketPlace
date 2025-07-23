const { getMessages } = require('../services/chat.service');
const { logger } = require('../../../utils/logger');

const getMessagesController = async (req, res, next) => {
  try {
    const { receiverId } = req.query;
    const userId = req.user.id; // From JWT
    const messages = await getMessages(userId, parseInt(receiverId));
    res.json({ messages });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessagesController };