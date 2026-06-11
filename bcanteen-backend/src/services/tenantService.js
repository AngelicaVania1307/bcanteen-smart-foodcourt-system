// src/services/tenantService.js
const { pool } = require('../config/database');

async function getAllTenants({ search, foodcourtId } = {}) {
  let sql    = `SELECT t.*, f.name AS foodcourt_name, f.location AS foodcourt_location
                FROM   tenants t
                JOIN   foodcourts f ON f.id = t.foodcourt_id`;
  const params = [];
  const conditions = [];

  if (foodcourtId) {
    conditions.push('t.foodcourt_id = ?');
    params.push(foodcourtId);
  }

  if (search) {
    conditions.push('(t.name LIKE ? OR t.description LIKE ? OR t.cuisine_type LIKE ?)');
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  if (conditions.length) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY t.rating DESC';

  const [rows] = await pool.query(sql, params);
  return rows;
}

async function getTenantById(id) {
  const [rows] = await pool.query(
    `SELECT t.*, f.name AS foodcourt_name, f.location AS foodcourt_location
     FROM   tenants t
     JOIN   foodcourts f ON f.id = t.foodcourt_id
     WHERE  t.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function getTenantsByFoodcourt(foodcourtId) {
  const [rows] = await pool.query(
    `SELECT * FROM tenants WHERE foodcourt_id = ? ORDER BY rating DESC`,
    [foodcourtId]
  );
  return rows;
}

module.exports = { getAllTenants, getTenantById, getTenantsByFoodcourt };
