const express = require('express');
const { body, validationResult } = require('express-validator');
const { Product, User } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all products (public access)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const where = { isActive: true };
    
    if (category && category !== 'All') where.category = category;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;
    const products = await Product.findAll({
      where,
      attributes: { exclude: ['createdBy'] }, // Don't include createdBy for public access
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Convert price to number for frontend compatibility
    const processedProducts = products.map(product => {
      const productData = product.toJSON();
      return {
        ...productData,
        price: parseFloat(productData.price)
      };
    });

    const total = await Product.count({ where });

    res.json({
      products: processedProducts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all categories (public access)
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.findAll({
      where: { isActive: true },
      attributes: ['category'],
      group: ['category'],
      raw: true
    });
    const categoryList = categories.map(cat => cat.category);
    res.json(categoryList || []);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['username']
      }]
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Convert price to number for frontend compatibility
    const processedProduct = {
      ...product.toJSON(),
      price: parseFloat(product.price)
    };

    res.json(processedProduct);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (Admin only)
router.post('/', [
  adminAuth,
  body('name').trim().isLength({ min: 1 }),
  body('price').isFloat({ min: 0 }),
  body('category').trim().isLength({ min: 1 }),
  body('stock').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const productData = {
      ...req.body,
      createdBy: req.user.id
    };

    const product = await Product.create(productData);

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Admin only)
router.put('/:id', [
  adminAuth,
  body('name').optional().trim().isLength({ min: 1 }),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().trim().isLength({ min: 1 }),
  body('stock').optional().isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update(req.body);
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update({ isActive: false });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update stock (Admin only)
router.patch('/:id/stock', [
  adminAuth,
  body('stock').isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update({ stock: req.body.stock });
    res.json(product);
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
