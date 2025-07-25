const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

module.exports = { errorHandler };