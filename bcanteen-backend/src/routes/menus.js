// src/routes/menus.js
const router      = require('express').Router();
const controller  = require('../controllers/menuController');

// GET /api/menus
router.get('/',     controller.index);

// GET /api/menus/:id
router.get('/:id',  controller.show);

module.exports = router;
