// src/services/menuService.js
const { pool } = require('../config/database');

async function getAllMenus({ search, category, tenantId } = {}) {
  let sql      = `SELECT m.*, t.name AS tenant_name
                  FROM   menus m
                  JOIN   tenants t ON t.id = m.tenant_id`;
  const params = [];
  const conds  = [];

  if (tenantId) {
    conds.push('m.tenant_id = ?');
    params.push(tenantId);
  }

  if (category) {
    conds.push('m.category = ?');
    params.push(category);
  }

  if (search) {
    conds.push('(m.name LIKE ? OR m.description LIKE ?)');
    const like = `%${search}%`;
    params.push(like, like);
  }

  if (conds.length) sql += ' WHERE ' + conds.join(' AND ');

  sql += ' ORDER BY m.category, m.name';

  const [rows] = await pool.query(sql, params);
  return rows;
}

async function getMenuById(id) {
  const [rows] = await pool.query(
    `SELECT m.*, t.name AS tenant_name
     FROM   menus m
     JOIN   tenants t ON t.id = m.tenant_id
     WHERE  m.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function getMenusByTenant(tenantId, { search, category } = {}) {
  let sql      = 'SELECT * FROM menus WHERE tenant_id = ?';
  const params = [tenantId];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    const like = `%${search}%`;
    params.push(like, like);
  }

  sql += ' ORDER BY category, name';

  const [rows] = await pool.query(sql, params);
  return rows;
}

async function getCategoriesByTenant(tenantId) {
  const [rows] = await pool.query(
    `SELECT DISTINCT category FROM menus WHERE tenant_id = ? ORDER BY category`,
    [tenantId]
  );
  return rows.map(r => r.category);
}

module.exports = { getAllMenus, getMenuById, getMenusByTenant, getCategoriesByTenant };
