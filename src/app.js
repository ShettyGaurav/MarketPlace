require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { errorHandler } = require('./middleware/error.middleware');
const authRoutes = require('./api/auth/routes/auth.routes');
const productRoutes = require('./api/products/routes/product.routes');
const orderRoutes = require('./api/orders/routes/order.routes');
const chatRoutes = require('./api/chat/routes/chat.routes');
const uploadRoutes = require('./api/upload/routes/upload.routes');
const analyticsRoutes = require('./api/analytics/routes/analytics.routes');
const { setupChatSocket } = require('./sockets/chat.socket');
const {logger} = require('./utils/logger');
const pool = require('./config/database');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
  })
);
app.use((req, res, next) => {
  req.logger = logger;
  next();
});

app.use('/uploads', express.static(process.env.UPLOAD_PATH || './uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);

setupChatSocket(io);

app.use(errorHandler);

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await pool.end();
  io.close();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = { app, pool, io };