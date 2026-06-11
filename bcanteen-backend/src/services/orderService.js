// src/services/orderService.js
const { pool }             = require('../config/database');
const { generateOrderCode } = require('../utils/orderCode');

/**
 * Create a new order.
 *
 * @param {Object} payload
 * @param {number}   payload.tenantId
 * @param {string}   [payload.notes]
 * @param {Array}    payload.items   - [{ menuId, quantity }]
 *
 * @returns {Object} The created order with items
 */
async function createOrder({ tenantId, notes = '', items }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Validate all menu items exist and are available
    const menuIds = items.map(i => i.menuId);
    const [menus] = await conn.query(
      `SELECT id, name, price, is_available, tenant_id
       FROM   menus
       WHERE  id IN (?)`,
      [menuIds]
    );

    if (menus.length !== menuIds.length) {
      throw Object.assign(new Error('One or more menu items not found'), { status: 404 });
    }

    const unavailable = menus.filter(m => !m.is_available);
    if (unavailable.length) {
      throw Object.assign(
        new Error(`These items are currently unavailable: ${unavailable.map(m => m.name).join(', ')}`),
        { status: 422 }
      );
    }

    // All menus must belong to the same tenant
    const wrongTenant = menus.filter(m => m.tenant_id !== tenantId);
    if (wrongTenant.length) {
      throw Object.assign(
        new Error('All items must belong to the selected tenant'),
        { status: 422 }
      );
    }

    // 2. Build a price map & calculate totals
    const priceMap = {};
    menus.forEach(m => { priceMap[m.id] = parseFloat(m.price); });

    let totalPrice = 0;
    const orderItems = items.map(item => {
      const subtotal = priceMap[item.menuId] * item.quantity;
      totalPrice += subtotal;
      return { menuId: item.menuId, quantity: item.quantity, subtotal };
    });

    // 3. Generate unique order code
    const orderCode = await generateOrderCode();

    // 4. Insert order
    const [orderResult] = await conn.query(
      `INSERT INTO orders (order_code, tenant_id, total_price, status, notes)
       VALUES (?, ?, ?, 'Pending', ?)`,
      [orderCode, tenantId, totalPrice, notes]
    );
    const orderId = orderResult.insertId;

    // 5. Insert order items
    const itemValues = orderItems.map(i => [orderId, i.menuId, i.quantity, i.subtotal]);
    await conn.query(
      `INSERT INTO order_items (order_id, menu_id, quantity, subtotal) VALUES ?`,
      [itemValues]
    );

    await conn.commit();

    // 6. Return full order
    return await getOrderByCode(orderCode);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

/**
 * Fetch an order with its items by order code.
 */
async function getOrderByCode(orderCode) {
  const [orders] = await pool.query(
    `SELECT o.*, t.name AS tenant_name, t.image_url AS tenant_image,
            f.name AS foodcourt_name, f.location AS foodcourt_location
     FROM   orders o
     JOIN   tenants t ON t.id = o.tenant_id
     JOIN   foodcourts f ON f.id = t.foodcourt_id
     WHERE  o.order_code = ?`,
    [orderCode]
  );

  if (!orders.length) return null;

  const order = orders[0];

  const [items] = await pool.query(
    `SELECT oi.id, oi.quantity, oi.subtotal,
            m.id AS menu_id, m.name AS menu_name,
            m.price, m.image_url, m.category
     FROM   order_items oi
     JOIN   menus m ON m.id = oi.menu_id
     WHERE  oi.order_id = ?`,
    [order.id]
  );

  order.items = items;
  return order;
}

module.exports = { createOrder, getOrderByCode };
