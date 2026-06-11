// src/services/foodcourtService.js
const { pool } = require('../config/database');

async function getAllFoodcourts({ search } = {}) {
  let sql    = 'SELECT * FROM foodcourts';
  const params = [];

  if (search) {
    sql += ' WHERE name LIKE ? OR description LIKE ? OR location LIKE ?';
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  sql += ' ORDER BY rating DESC';

  const [rows] = await pool.query(sql, params);
  return rows;
}

async function getFoodcourtById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM foodcourts WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

module.exports = { getAllFoodcourts, getFoodcourtById };
