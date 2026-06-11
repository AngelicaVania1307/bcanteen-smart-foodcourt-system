// src/controllers/tenantController.js
const tenantService         = require('../services/tenantService');
const menuService           = require('../services/menuService');
const { success, notFound } = require('../utils/response');

async function index(req, res, next) {
  try {
    const { search, foodcourt_id } = req.query;
    const data = await tenantService.getAllTenants({
      search,
      foodcourtId: foodcourt_id ? parseInt(foodcourt_id) : undefined,
    });
    return success(res, data);
  } catch (err) { next(err); }
}

async function show(req, res, next) {
  try {
    const tenant = await tenantService.getTenantById(req.params.id);
    if (!tenant) return notFound(res, 'Tenant not found');
    return success(res, tenant);
  } catch (err) { next(err); }
}

async function menus(req, res, next) {
  try {
    const tenant = await tenantService.getTenantById(req.params.id);
    if (!tenant) return notFound(res, 'Tenant not found');

    const { search, category } = req.query;
    const [menuList, categories] = await Promise.all([
      menuService.getMenusByTenant(tenant.id, { search, category }),
      menuService.getCategoriesByTenant(tenant.id),
    ]);

    return success(res, { tenant, categories, menus: menuList });
  } catch (err) { next(err); }
}

module.exports = { index, show, menus };
