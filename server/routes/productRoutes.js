const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  updateProductReview,
  deleteProductReview
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  uploadProductImages, 
  optimizeImages, 
  validateImageDimensions,
  handleMulterError,
  cleanupOnError 
} = require('../middleware/multerMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.use(protect);

// Review routes
router.post('/:id/reviews', addProductReview);
router.put('/:id/reviews/:reviewId', updateProductReview);
router.delete('/:id/reviews/:reviewId', deleteProductReview);

// Admin only routes
router.use(authorize('admin'));

// Product CRUD operations with image handling
router.post('/',
  uploadProductImages,
  handleMulterError,
  validateImageDimensions,
  optimizeImages,
  cleanupOnError,
  createProduct
);

router.put('/:id',
  uploadProductImages,
  handleMulterError,
  validateImageDimensions,
  optimizeImages,
  cleanupOnError,
  updateProduct
);

router.delete('/:id', deleteProduct);

// Export router
module.exports = router;