// src/utils/orderCode.js
const { pool } = require('../config/database');

/**
 * Generates the next unique order code in the format BCA-XXXX.
 * Uses a SELECT FOR UPDATE pattern to avoid race conditions.
 *
 * Examples: BCA-0001, BCA-0002, BCA-0099, BCA-1000
 */
async function generateOrderCode() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Find the highest existing sequence number
    const [rows] = await conn.query(
      `SELECT order_code
       FROM   orders
       ORDER  BY id DESC
       LIMIT  1
       FOR UPDATE`
    );

    let nextNum = 1;

    if (rows.length > 0) {
      // Extract numeric part: "BCA-0042" → 42
      const lastCode  = rows[0].order_code;          // e.g. "BCA-0042"
      const lastNum   = parseInt(lastCode.split('-')[1], 10);
      nextNum         = lastNum + 1;
    }

    const padded    = String(nextNum).padStart(4, '0');
    const orderCode = `BCA-${padded}`;

    await conn.commit();
    return orderCode;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { generateOrderCode };
