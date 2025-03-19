const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyEmail
} = require('../controllers/authController');
const { protect, rateLimit } = require('../middleware/authMiddleware');

// Rate limiting
const loginLimiter = rateLimit(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
const registerLimiter = rateLimit(3, 60 * 60 * 1000); // 3 attempts per hour

// Public routes
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/forgot-password', loginLimiter, forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.use(protect); // All routes below this will be protected

router.get('/me', getMe);
router.get('/logout', logout);
router.put('/update-password', updatePassword);

module.exports = router;