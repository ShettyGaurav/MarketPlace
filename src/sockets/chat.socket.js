const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');
const redis = require('../config/redis');
const { saveMessage } = require('../api/chat/services/chat.service');

const setupChatSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token?.split(' ')[1];
      if (!token) {
        throw new Error('No token provided');
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      logger.info(`Socket authenticated for user ${decoded.id}`);
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    logger.info(`User connected: ${socket.user.id}`);
    socket.join(`user:${socket.user.id}`);
    logger.info(`User ${socket.user.id} joined room user:${socket.user.id}`);
    await redis.set(`user:${socket.user.id}:online`, 'true');

    socket.broadcast.emit('userOnline', { userId: socket.user.id });

    socket.on('sendMessage', async ({ receiverId, content }) => {
      logger.info(`Received sendMessage: sender=${socket.user.id}, receiver=${receiverId}, content=${content}`);
      try {
        const message = await saveMessage({
          senderId: socket.user.id,
          receiverId,
          content,
        });
        logger.info(`Emitting receiveMessage to user:${receiverId} and sender ${socket.user.id}`);
        io.to(`user:${receiverId}`).emit('receiveMessage', message);
        socket.emit('receiveMessage', message);
      } catch (error) {
        logger.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing', ({ receiverId }) => {
      logger.info(`Emitting typing from ${socket.user.id} to user:${receiverId}`);
      io.to(`user:${receiverId}`).emit('typing', { senderId: socket.user.id });
    });

    socket.on('stopTyping', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('stopTyping', { senderId: socket.user.id });
    });

    socket.on('disconnect', async () => {
      logger.info(`User disconnected: ${socket.user.id}`);
      await redis.del(`user:${socket.user.id}:online`);
      socket.broadcast.emit('userOffline', { userId: socket.user.id });
    });
  });
};

module.exports = { setupChatSocket };