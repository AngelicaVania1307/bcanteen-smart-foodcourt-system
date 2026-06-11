// src/routes/orders.js
const router      = require('express').Router();
const controller  = require('../controllers/orderController');
const { body }    = require('express-validator');
const validate    = require('../middleware/validate');

// POST /api/orders
router.post(
  '/',
  [
    body('tenant_id')
      .notEmpty().withMessage('tenant_id is required')
      .isInt({ min: 1 }).withMessage('tenant_id must be a positive integer'),

    body('items')
      .notEmpty().withMessage('items is required')
      .isArray({ min: 1 }).withMessage('items must be a non-empty array'),

    body('items.*.menu_id')
      .notEmpty().withMessage('Each item must have menu_id')
      .isInt({ min: 1 }).withMessage('menu_id must be a positive integer'),

    body('items.*.quantity')
      .notEmpty().withMessage('Each item must have quantity')
      .isInt({ min: 1 }).withMessage('quantity must be >= 1'),

    body('notes')
      .optional()
      .isString()
      .isLength({ max: 500 }).withMessage('Notes max 500 characters'),
  ],
  validate,
  controller.store
);

// GET /api/orders/:orderCode
router.get('/:orderCode', controller.show);

module.exports = router;
