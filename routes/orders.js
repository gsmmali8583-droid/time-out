const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/orders - Get user's orders
router.get('/', auth.authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// POST /api/orders - Create new order
router.post('/', async (req, res) => {
  try {
    const {
      customerInfo,
      shippingAddress,
      billingAddress,
      paymentMethod,
      items,
      subtotal,
      tax,
      total
    } = req.body;

    // Validate required fields
    if (!customerInfo || !shippingAddress || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order information'
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create order
    const order = new Order({
      orderNumber,
      user: null, // Anonymous order for now
      customerInfo,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'test' ? 'completed' : 'pending',
      items,
      pricing: {
        subtotal,
        tax,
        shipping: 0,
        discount: 0,
        total
      },
      status: 'confirmed',
      orderNotes: 'Order placed via website'
    });

    await order.save();

    // Populate product details for response
    await order.populate('items.product');

    res.status(201).json({
      success: true,
      data: {
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.pricing.total,
          createdAt: order.createdAt
        }
      },
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', auth.authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// PUT /api/orders/:id/status - Update order status (admin only)
router.put('/:id/status', auth.authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

module.exports = router;
