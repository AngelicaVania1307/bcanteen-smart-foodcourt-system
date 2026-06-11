// src/middleware/validate.js
const { validationResult } = require('express-validator');

/**
 * Runs after express-validator chains.
 * If there are errors, respond 400 immediately.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors:  errors.array(),
    });
  }
  next();
}

module.exports = validate;
