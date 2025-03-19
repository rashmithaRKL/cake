const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  uploadProductImages, 
  optimizeImages, 
  validateImageDimensions 
} = require('../middleware/multerMiddleware');

// Protect all admin routes and require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard Statistics
router.get('/dashboard', async (req, res) => {
  try {
    const Order = require('../models/Order');
    const Product = require('../models/Product');
    const User = require('../models/User');

    // Get statistics
    const stats = {
      totalOrders: await Order.countDocuments(),
      pendingOrders: await Order.countDocuments({ orderStatus: 'pending' }),
      totalProducts: await Product.countDocuments(),
      totalUsers: await User.countDocuments(),
      revenue: {
        daily: await calculateRevenue('daily'),
        weekly: await calculateRevenue('weekly'),
        monthly: await calculateRevenue('monthly')
      },
      topProducts: await getTopProducts(),
      recentOrders: await getRecentOrders(),
      lowStockProducts: await getLowStockProducts()
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error fetching dashboard statistics'
    });
  }
});

// Bulk Operations
router.post('/products/bulk', async (req, res) => {
  try {
    const Product = require('../models/Product');
    const { operation, products } = req.body;

    switch (operation) {
      case 'update':
        await Promise.all(
          products.map(product =>
            Product.findByIdAndUpdate(product._id, product, {
              new: true,
              runValidators: true
            })
          )
        );
        break;
      case 'delete':
        await Product.deleteMany({ _id: { $in: products } });
        break;
      default:
        throw new Error('Invalid bulk operation');
    }

    res.status(200).json({
      success: true,
      message: 'Bulk operation completed successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// User Management
router.get('/users', async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error fetching users'
    });
  }
});

router.put('/users/:id/role', async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error updating user role'
    });
  }
});

// Reports
router.get('/reports/sales', async (req, res) => {
  try {
    const Order = require('../models/Order');
    const { startDate, endDate } = req.query;

    const salesReport = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          orderStatus: 'delivered'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalSales: { $sum: '$pricing.total' },
          ordersCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: salesReport
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error generating sales report'
    });
  }
});

router.get('/reports/inventory', async (req, res) => {
  try {
    const Product = require('../models/Product');
    
    const inventoryReport = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          totalStock: { $sum: '$stock' },
          lowStock: {
            $sum: { $cond: [{ $lt: ['$stock', 10] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: inventoryReport
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error generating inventory report'
    });
  }
});

// Helper Functions
async function calculateRevenue(period) {
  const Order = require('../models/Order');
  const now = new Date();
  let startDate;

  switch (period) {
    case 'daily':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'weekly':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'monthly':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
  }

  const result = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        orderStatus: 'delivered'
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$pricing.total' }
      }
    }
  ]);

  return result[0]?.total || 0;
}

async function getTopProducts() {
  const Order = require('../models/Order');
  
  return Order.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' }
  ]);
}

async function getRecentOrders() {
  const Order = require('../models/Order');
  
  return Order.find()
    .sort('-createdAt')
    .limit(10)
    .populate('user', 'name email')
    .populate('items.product', 'name');
}

async function getLowStockProducts() {
  const Product = require('../models/Product');
  
  return Product.find({ stock: { $lt: 10 } })
    .select('name stock category')
    .sort('stock');
}

module.exports = router;