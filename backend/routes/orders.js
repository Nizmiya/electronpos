const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all orders
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    const query = {};
    
    // If not admin, only show their orders
    if (req.user.role !== 'admin') {
      query.cashier = req.user._id;
    }
    
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('items.product', 'name price')
      .populate('cashier', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
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
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name price category')
      .populate('cashier', 'username');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this order
    if (req.user.role !== 'admin' && order.cashier._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order
router.post('/', [
  auth,
  body('items').isArray({ min: 1 }),
  body('items.*.product').isMongoId(),
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
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product ${item.product} not found or inactive` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        subtotal: itemSubtotal
      });
    }

    const total = subtotal + tax - discount;

    // Create order
    const order = new Order({
      items: orderItems,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      paymentStatus: 'completed',
      status: 'completed',
      cashier: req.user._id,
      customerInfo
    });

    await order.save();

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Populate order data for response
    await order.populate([
      { path: 'items.product', select: 'name price category' },
      { path: 'cashier', select: 'username' }
    ]);

    res.status(201).json(order);
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

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate([
      { path: 'items.product', select: 'name price' },
      { path: 'cashier', select: 'username' }
    ]);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const query = {};
    if (req.user.role !== 'admin') {
      query.cashier = req.user._id;
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
      Order.countDocuments(query),
      Order.countDocuments({ ...query, createdAt: { $gte: today, $lt: tomorrow } }),
      Order.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $match: { ...query, createdAt: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.countDocuments({ ...query, status: 'pending' })
    ]);

    res.json({
      totalOrders,
      todayOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayRevenue: todayRevenue[0]?.total || 0,
      pendingOrders
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
