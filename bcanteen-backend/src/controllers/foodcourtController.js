// src/controllers/foodcourtController.js
const foodcourtService      = require('../services/foodcourtService');
const tenantService         = require('../services/tenantService');
const { success, notFound } = require('../utils/response');

async function index(req, res, next) {
  try {
    const { search } = req.query;
    const data = await foodcourtService.getAllFoodcourts({ search });
    return success(res, data);
  } catch (err) { next(err); }
}

async function show(req, res, next) {
  try {
    const foodcourt = await foodcourtService.getFoodcourtById(req.params.id);
    if (!foodcourt) return notFound(res, 'Foodcourt not found');

    // Also attach tenants
    const tenants   = await tenantService.getTenantsByFoodcourt(foodcourt.id);
    foodcourt.tenants = tenants;

    return success(res, foodcourt);
  } catch (err) { next(err); }
}

module.exports = { index, show };
