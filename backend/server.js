const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
