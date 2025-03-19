const Product = require('../models/Product');
const { logger } = require('../config/db');
const path = require('path');
const fs = require('fs').promises;

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    // Handle file uploads
    if (req.files) {
      const images = req.files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        altText: req.body.name,
        isMain: index === 0 // First image is main by default
      }));
      req.body.images = images;
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    logger.error(`Create Product Error: ${err.message}`);
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query = Product.find(JSON.parse(queryStr));

    // Search functionality
    if (req.query.search) {
      query = query.find({
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } }
        ]
      });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const products = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products
    });
  } catch (err) {
    logger.error(`Get Products Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    logger.error(`Get Product Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      // Delete old images
      for (const image of product.images) {
        const imagePath = path.join(__dirname, '..', 'public', image.url);
        await fs.unlink(imagePath).catch(err => logger.error(`Delete Image Error: ${err.message}`));
      }

      // Add new images
      req.body.images = req.files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        altText: req.body.name || product.name,
        isMain: index === 0
      }));
    }

    // Add updatedBy field
    req.body.updatedBy = req.user.id;
    req.body.updatedAt = Date.now();

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    logger.error(`Update Product Error: ${err.message}`);
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Delete product images
    for (const image of product.images) {
      const imagePath = path.join(__dirname, '..', 'public', image.url);
      await fs.unlink(imagePath).catch(err => logger.error(`Delete Image Error: ${err.message}`));
    }

    await product.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    logger.error(`Delete Product Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        error: 'Product already reviewed'
      });
    }

    const review = {
      user: req.user.id,
      rating: Number(req.body.rating),
      comment: req.body.comment
    };

    product.reviews.push(review);
    product.calculateAverageRating();

    await product.save();

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    logger.error(`Add Review Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update product review
// @route   PUT /api/products/:id/reviews/:reviewId
// @access  Private
exports.updateProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Make sure review belongs to user
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this review'
      });
    }

    review.rating = Number(req.body.rating) || review.rating;
    review.comment = req.body.comment || review.comment;

    product.calculateAverageRating();
    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    logger.error(`Update Review Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete product review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
exports.deleteProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const review = product.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this review'
      });
    }

    product.reviews = product.reviews.filter(
      review => review._id.toString() !== req.params.reviewId
    );

    product.calculateAverageRating();
    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    logger.error(`Delete Review Error: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};