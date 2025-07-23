const Redis = require('ioredis');
const { logger } = require('../utils/logger');

const redis = new Redis(process.env.REDIS_URL);

redis.on('error', (err) => {
  logger.error('Redis connection error:', err);
  process.exit(1);
});

module.exports = redis;