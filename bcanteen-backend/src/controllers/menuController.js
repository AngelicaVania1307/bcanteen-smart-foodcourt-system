// src/controllers/menuController.js
const menuService           = require('../services/menuService');
const { success, notFound } = require('../utils/response');

async function index(req, res, next) {
  try {
    const { search, category, tenant_id } = req.query;
    const data = await menuService.getAllMenus({
      search,
      category,
      tenantId: tenant_id ? parseInt(tenant_id) : undefined,
    });
    return success(res, data);
  } catch (err) { next(err); }
}

async function show(req, res, next) {
  try {
    const menu = await menuService.getMenuById(req.params.id);
    if (!menu) return notFound(res, 'Menu item not found');
    return success(res, menu);
  } catch (err) { next(err); }
}

module.exports = { index, show };
