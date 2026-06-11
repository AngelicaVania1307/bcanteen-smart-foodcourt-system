// src/routes/tenants.js
const router      = require('express').Router();
const controller  = require('../controllers/tenantController');

// GET /api/tenants
router.get('/',              controller.index);

// GET /api/tenants/:id
router.get('/:id',           controller.show);

// GET /api/tenants/:id/menus
router.get('/:id/menus',     controller.menus);

module.exports = router;
