// src/middleware/errorHandler.js

/**
 * Global error handling middleware.
 * Must have 4 parameters so Express recognises it as an error handler.
 */
function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.originalUrl} →`, err);

  // Validation errors (express-validator)
  if (err.type === 'validation') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors:  err.errors,
    });
  }

  // MySQL duplicate-entry
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry — resource already exists.',
    });
  }

  // Generic
  const status  = err.status  || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return res.status(status).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
