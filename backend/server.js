const express = require('express');
const cors = require('cors');
require('dotenv').config();
const config = require('./config');
const { sequelize, syncDatabase } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Connect to MySQL and start server
const startServer = async () => {
  try {
    // Test MySQL connection
    await sequelize.authenticate();
    console.log('Connected to MySQL database');

    // Start server immediately; run sync in background to avoid blocking startup
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });

    // Run database sync without blocking server start
    syncDatabase().catch((err) => {
      console.error('Error syncing database:', err);
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

startServer();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
