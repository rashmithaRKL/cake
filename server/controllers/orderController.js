const Order = require('../models/Order');
const Product = require('../models/Product');
const { logger } = require('../config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      deliveryInfo,
      specialInstructions,
      giftOptions
    } = req.body;

    // Validate items stock and calculate total
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product not found with ID: ${item.product}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for product: ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
        customizations: item.customizations
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate tax and delivery fee
    const tax = subtotal * 0.08; // 8% tax
    const deliveryFee = deliveryInfo.type === 'delivery' ? 10 : 0; // $10 delivery fee
    const total = subtotal + tax + deliveryFee;

    // Create order
    const order = await Order.create({
      orderNumber: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      billingAddress,
      paymentInfo: {
        method: paymentMethod,
        amount: total,
        status: 'pending'
      },
      delivery: {
        ...deliveryInfo,
        deliveryFee
      },
      pricing: {
        subtotal,
        tax,
        deliveryFee,
        total
      },
      specialInstructions,
      giftOptions
    });

    // Process payment
    let paymentIntent;
    if (paymentMethod === 'stripe') {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to cents
        currency: 'usd',
        customer: req.user.stripeCustomerId,
        metadata: {
          orderId: order._id.toString()
        }
      });

      // Update order with payment intent
      order.paymentInfo.transactionId = paymentIntent.id;
      await order.save();
    }

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    io.emit('newOrder', { orderId: order._id });

    res.status(201).json({
      success: true,
      data: order,
      clientSecret: paymentIntent?.client_secret
    });
  } catch (err) {
    logger.error(`Create Order Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Error creating order'
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name images');

    // Filter by status
    if (req.query.status) {
      query = query.where('orderStatus').equals(req.query.status);
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query = query.where('createdAt').gte(req.query.startDate).lte(req.query.endDate);
    }

    // Search by order number
    if (req.query.search) {
      query = query.where('orderNumber').regex(new RegExp(req.query.search, 'i'));
    }

    const total = await Order.countDocuments(query);
    const orders = await query.skip(startIndex).limit(limit).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (err) {
    logger.error(`Get Orders Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Error fetching orders'
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name images price')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    logger.error(`Get User Orders Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Error fetching orders'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images price');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user is authorized to view this order
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    logger.error(`Get Order Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Error fetching order'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Update status
    order.orderStatus = req.body.status;
    order.statusHistory.push({
      status: req.body.status,
      note: req.body.note,
      updatedBy: req.user.id
    });

    // If order is delivered, update delivery info
    if (req.body.status === 'delivered') {
      order.delivery.actualDeliveryDate = Date.now();
    }

    await order.save();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    io.to(`order_${order._id}`).emit('orderStatusUpdate', {
      orderId: order._id,
      status: order.orderStatus
    });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    logger.error(`Update Order Status Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Error updating order status'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Order cannot be cancelled at this stage'
      });
    }

    // Check if user is authorized
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to cancel this order'
      });
    }

    // Update order
    order.orderStatus = 'cancelled';
    order.cancellation = {
      isCancelled: true,
      reason: req.body.reason,
      cancelledAt: Date.now(),
      cancelledBy: req.user.id
    };

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // Process refund if payment was made
    if (order.paymentInfo.status === 'completed') {
      try {
        const refund = await stripe.refunds.create({
          payment_intent: order.paymentInfo.transactionId
        });

        order.cancellation.refundStatus = 'processed';
      } catch (err) {
        logger.error(`Refund Error: ${err.message}`);
        order.cancellation.refundStatus = 'failed';
      }
    }

    await order.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(`order_${order._id}`).emit('orderCancelled', {
      orderId: order._id
    });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    logger.error(`Cancel Order Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Error cancelling order'
    });
  }
};