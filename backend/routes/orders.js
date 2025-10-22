const express = require('express');
const { body, validationResult } = require('express-validator');
const { Order, Product, OrderItem, User } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const { Op } = require('sequelize');

const router = express.Router();

// Get all orders
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    const where = {};
    
    // If not admin, only show their orders
    if (req.user.role !== 'admin') {
      where.cashier = req.user.id;
    }
    
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const offset = (page - 1) * limit;
    const orders = await Order.findAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['name', 'price']
          }]
        },
        {
          model: User,
          as: 'cashierUser',
          attributes: ['username']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      raw: false
    });

    // Convert prices to numbers for frontend compatibility
    const processedOrders = orders.map(order => {
      const orderData = order.toJSON();
      orderData.subtotal = parseFloat(orderData.subtotal);
      orderData.tax = parseFloat(orderData.tax);
      orderData.discount = parseFloat(orderData.discount);
      orderData.total = parseFloat(orderData.total);
      
      if (orderData.items) {
        orderData.items = orderData.items.map(item => ({
          ...item,
          price: parseFloat(item.price),
          subtotal: parseFloat(item.subtotal),
          product: item.product ? {
            ...item.product,
            price: parseFloat(item.product.price)
          } : item.product
        }));
      }
      
      return orderData;
    });

    const total = await Order.count({ where });

    res.json({
      orders: processedOrders,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['name', 'price', 'category']
          }]
        },
        {
          model: User,
          as: 'cashierUser',
          attributes: ['username']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this order
    if (req.user.role !== 'admin' && order.cashier !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Convert prices to numbers for frontend compatibility
    const orderData = order.toJSON();
    orderData.subtotal = parseFloat(orderData.subtotal);
    orderData.tax = parseFloat(orderData.tax);
    orderData.discount = parseFloat(orderData.discount);
    orderData.total = parseFloat(orderData.total);
    
    if (orderData.items) {
      orderData.items = orderData.items.map(item => ({
        ...item,
        price: parseFloat(item.price),
        subtotal: parseFloat(item.subtotal),
        product: item.product ? {
          ...item.product,
          price: parseFloat(item.product.price)
        } : item.product
      }));
    }

    res.json(orderData);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order (no authentication required for POS)
router.post('/', [
  body('items').isArray({ min: 1 }),
  body('items.*.product').isInt(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('paymentMethod').isIn(['cash', 'card', 'upi']),
  body('customerInfo').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, paymentMethod, customerInfo, discount = 0, tax = 0 } = req.body;

    // Validate products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product ${item.product} not found or inactive` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const itemSubtotal = parseFloat(product.price) * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: parseFloat(product.price),
        subtotal: itemSubtotal
      });
    }

    const total = subtotal + tax - discount;

    // Create order with transaction
    const transaction = await Order.sequelize.transaction();
    
    try {
      // Generate order number
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      const orderNumber = `ORD-${timestamp}-${random}`;
      
      const order = await Order.create({
        orderNumber: orderNumber,
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax),
        discount: parseFloat(discount),
        total: parseFloat(total),
        paymentMethod,
        paymentStatus: 'completed',
        status: 'completed',
        cashier: req.user ? req.user.id : null,
        customerName: customerInfo?.name || null,
        customerEmail: customerInfo?.email || null,
        customerPhone: customerInfo?.phone || null
      }, { transaction });

      // Create order items
      for (const item of orderItems) {
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: parseFloat(item.price),
          subtotal: parseFloat(item.subtotal)
        }, { transaction });
      }

      // Update product stock
      for (const item of orderItems) {
        await Product.decrement('stock', {
          by: item.quantity,
          where: { id: item.productId },
          transaction
        });
      }

      await transaction.commit();

      // Fetch order with relations
      const orderWithItems = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['name', 'price', 'category']
            }]
          },
          {
            model: User,
            as: 'cashierUser',
            attributes: ['username']
          }
        ]
      });

      // Convert prices to numbers for frontend compatibility
      const orderData = orderWithItems.toJSON();
      orderData.subtotal = parseFloat(orderData.subtotal);
      orderData.tax = parseFloat(orderData.tax);
      orderData.discount = parseFloat(orderData.discount);
      orderData.total = parseFloat(orderData.total);
      
      if (orderData.items) {
        orderData.items = orderData.items.map(item => ({
          ...item,
          price: parseFloat(item.price),
          subtotal: parseFloat(item.subtotal),
          product: item.product ? {
            ...item.product,
            price: parseFloat(item.product.price)
          } : item.product
        }));
      }

      res.status(201).json(orderData);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Admin only)
router.patch('/:id/status', [
  adminAuth,
  body('status').isIn(['pending', 'completed', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status: req.body.status });

    const orderWithItems = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['name', 'price']
          }]
        },
        {
          model: User,
          as: 'cashierUser',
          attributes: ['username']
        }
      ]
    });

    // Convert prices to numbers for frontend compatibility
    const orderData = orderWithItems.toJSON();
    orderData.subtotal = parseFloat(orderData.subtotal);
    orderData.tax = parseFloat(orderData.tax);
    orderData.discount = parseFloat(orderData.discount);
    orderData.total = parseFloat(orderData.total);
    
    if (orderData.items) {
      orderData.items = orderData.items.map(item => ({
        ...item,
        price: parseFloat(item.price),
        subtotal: parseFloat(item.subtotal),
        product: item.product ? {
          ...item.product,
          price: parseFloat(item.product.price)
        } : item.product
      }));
    }

    res.json(orderData);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const where = {};
    if (req.user.role !== 'admin') {
      where.cashier = req.user.id;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
      pendingOrders
    ] = await Promise.all([
      Order.count({ where }),
      Order.count({ where: { ...where, createdAt: { [Op.gte]: today, [Op.lt]: tomorrow } } }),
      Order.sum('total', { where }),
      Order.sum('total', { where: { ...where, createdAt: { [Op.gte]: today, [Op.lt]: tomorrow } } }),
      Order.count({ where: { ...where, status: 'pending' } })
    ]);

    res.json({
      totalOrders,
      todayOrders,
      totalRevenue: totalRevenue || 0,
      todayRevenue: todayRevenue || 0,
      pendingOrders
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
