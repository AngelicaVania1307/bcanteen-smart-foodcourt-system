// src/routes/foodcourts.js
const router      = require('express').Router();
const controller  = require('../controllers/foodcourtController');

// GET /api/foodcourts
router.get('/',     controller.index);

// GET /api/foodcourts/:id
router.get('/:id',  controller.show);

module.exports = router;
