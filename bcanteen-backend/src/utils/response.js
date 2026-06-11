// src/utils/response.js

/**
 * Standardised API response helpers.
 */

function success(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function created(res, data = null, message = 'Created successfully') {
  return success(res, data, message, 201);
}

function notFound(res, message = 'Resource not found') {
  return res.status(404).json({
    success: false,
    message,
  });
}

function badRequest(res, message = 'Bad request') {
  return res.status(400).json({
    success: false,
    message,
  });
}

module.exports = { success, created, notFound, badRequest };
