const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect, authorize, verifyEmail } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Require email verification for creating orders
router.post('/', verifyEmail, createOrder);

// Customer routes
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

// Admin only routes
router.use(authorize('admin'));
router.get('/', getOrders);
router.put('/:id/status', updateOrderStatus);

// Webhook route for payment processing (Stripe)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Update order status
        const order = await Order.findOne({
          'paymentInfo.transactionId': paymentIntent.id
        });
        if (order) {
          order.paymentInfo.status = 'completed';
          order.orderStatus = 'confirmed';
          order.statusHistory.push({
            status: 'confirmed',
            note: 'Payment received',
            timestamp: Date.now()
          });
          await order.save();

          // Emit socket event
          const io = req.app.get('io');
          io.to(`order_${order._id}`).emit('orderStatusUpdate', {
            orderId: order._id,
            status: order.orderStatus
          });
        }
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        // Handle failed payment
        const failedOrder = await Order.findOne({
          'paymentInfo.transactionId': failedPayment.id
        });
        if (failedOrder) {
          failedOrder.paymentInfo.status = 'failed';
          failedOrder.statusHistory.push({
            status: 'pending',
            note: 'Payment failed',
            timestamp: Date.now()
          });
          await failedOrder.save();

          // Emit socket event
          const io = req.app.get('io');
          io.to(`order_${failedOrder._id}`).emit('paymentFailed', {
            orderId: failedOrder._id
          });
        }
        break;
      // Handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

// Socket.IO connection handler
router.ws = (io) => {
  io.on('connection', (socket) => {
    // Join order room for real-time updates
    socket.on('join_order_room', (orderId) => {
      socket.join(`order_${orderId}`);
    });

    // Leave order room
    socket.on('leave_order_room', (orderId) => {
      socket.leave(`order_${orderId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      // Clean up any necessary resources
    });
  });
};

module.exports = router;