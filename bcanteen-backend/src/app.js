// src/app.js
require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const { testConnection } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// ── Routes ──────────────────────────────────────────────────
const foodcourtsRouter = require('./routes/foodcourts');
const tenantsRouter    = require('./routes/tenants');
const menusRouter      = require('./routes/menus');
const ordersRouter     = require('./routes/orders');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'BCanteen API is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ───────────────────────────────────────────────
app.use('/api/foodcourts', foodcourtsRouter);
app.use('/api/tenants',    tenantsRouter);
app.use('/api/menus',      menusRouter);
app.use('/api/orders',     ordersRouter);

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ── Global error handler ─────────────────────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────
async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`🚀  BCanteen API running on http://localhost:${PORT}`);
    console.log(`📋  Health check: http://localhost:${PORT}/api/health`);
  });
}

start();

module.exports = app;
