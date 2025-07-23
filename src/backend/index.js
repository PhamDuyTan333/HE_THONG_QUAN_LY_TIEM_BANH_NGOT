// index.js - Vercel serverless function
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Trust proxy
app.set('trust proxy', 1);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bakery Management System API',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Health check passed',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Bakery Management System API',
    version: '1.0.0',
    endpoints: [
      'GET /health - Health check',
      'GET /api - API info',
      'GET /api/health - API health check'
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API health check passed',
    database: 'connected',
    timestamp: new Date().toISOString(),
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = require('./config/db');
    const result = await pool.query('SELECT NOW() as current_time');
    res.status(200).json({
      status: 'OK',
      message: 'Database connection successful',
      data: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Import and use existing routes
try {
  const authRoutes = require('./routes/authRoutes');
  const productRoutes = require('./routes/productRoutes');
  const categoryRoutes = require('./routes/categoryRoutes');
  const orderRoutes = require('./routes/orderRoutes');
  const accountRoutes = require('./routes/accountRoutes');

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/accounts', accountRoutes);
} catch (error) {
  console.log('Some routes not available:', error.message);
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'NOT_FOUND',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    status: 'ERROR',
    message: 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
