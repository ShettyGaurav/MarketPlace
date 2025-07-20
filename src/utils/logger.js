// src/utils/logger.js
const pino = require('pino');

const isTest = process.env.NODE_ENV === 'test';

const logger = pino(
  isTest
    ? { enabled: false } 
    : {
        level: process.env.LOG_LEVEL || 'info',
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }
);

module.exports = { logger };
