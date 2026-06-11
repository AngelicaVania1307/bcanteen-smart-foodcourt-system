// src/controllers/orderController.js
const orderService                = require('../services/orderService');
const { success, created, notFound, badRequest } = require('../utils/response');

async function store(req, res, next) {
  try {
    const { tenant_id, notes, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return badRequest(res, 'Order must contain at least one item');
    }

    // Validate each item shape
    for (const item of items) {
      if (!item.menu_id || !item.quantity || item.quantity < 1) {
        return badRequest(res, 'Each item must have a valid menu_id and quantity >= 1');
      }
    }

    const order = await orderService.createOrder({
      tenantId: parseInt(tenant_id),
      notes:    notes || '',
      items:    items.map(i => ({
        menuId:   parseInt(i.menu_id),
        quantity: parseInt(i.quantity),
      })),
    });

    return created(res, order, 'Order placed successfully');
  } catch (err) { next(err); }
}

async function show(req, res, next) {
  try {
    const order = await orderService.getOrderByCode(req.params.orderCode);
    if (!order) return notFound(res, 'Order not found');
    return success(res, order);
  } catch (err) { next(err); }
}

module.exports = { store, show };
