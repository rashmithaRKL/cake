const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { logger } = require('../config/db');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store files based on type
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'productImages') {
      uploadPath += 'products/';
    } else if (file.fieldname === 'avatar') {
      uploadPath += 'avatars/';
    } else {
      uploadPath += 'others/';
    }
    
    // Create path if it doesn't exist
    const fs = require('fs');
    fs.mkdirSync(uploadPath, { recursive: true });
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    cb(null, `${Date.now()}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    'image/jpeg': true,
    'image/png': true,
    'image/webp': true
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WebP files are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files per request
  }
});

// Middleware for handling multiple product images
exports.uploadProductImages = upload.array('productImages', 10);

// Middleware for handling single avatar upload
exports.uploadAvatar = upload.single('avatar');

// Error handling middleware for multer
exports.handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          error: 'File too large. Maximum size is 5MB.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          error: 'Too many files. Maximum is 10 files.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          error: 'Unexpected field name in upload.'
        });
      default:
        logger.error(`Multer Error: ${err.message}`);
        return res.status(400).json({
          success: false,
          error: 'Error uploading file.'
        });
    }
  }

  if (err) {
    logger.error(`File Upload Error: ${err.message}`);
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  next();
};

// Image optimization middleware
exports.optimizeImages = async (req, res, next) => {
  try {
    const sharp = require('sharp');
    
    // Handle single file upload
    if (req.file) {
      const optimizedBuffer = await sharp(req.file.path)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 80 })
        .toBuffer();

      await sharp(optimizedBuffer).toFile(req.file.path);
    }
    
    // Handle multiple files upload
    if (req.files) {
      await Promise.all(
        req.files.map(async file => {
          const optimizedBuffer = await sharp(file.path)
            .resize(800, 800, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toBuffer();

          await sharp(optimizedBuffer).toFile(file.path);
        })
      );
    }

    next();
  } catch (err) {
    logger.error(`Image Optimization Error: ${err.message}`);
    return res.status(500).json({
      success: false,
      error: 'Error optimizing images'
    });
  }
};

// Clean up uploaded files on error
exports.cleanupOnError = (req, res, next) => {
  const fs = require('fs');
  
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      // Remove uploaded files if there was an error
      if (req.file) {
        fs.unlink(req.file.path, err => {
          if (err) logger.error(`File Cleanup Error: ${err.message}`);
        });
      }
      
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(file.path, err => {
            if (err) logger.error(`File Cleanup Error: ${err.message}`);
          });
        });
      }
    }
  });
  
  next();
};

// Validate image dimensions middleware
exports.validateImageDimensions = async (req, res, next) => {
  try {
    const sharp = require('sharp');
    const validateDimensions = async (file) => {
      const metadata = await sharp(file.path).metadata();
      return metadata.width >= 400 && metadata.height >= 400;
    };

    if (req.file) {
      const isValid = await validateDimensions(req.file);
      if (!isValid) {
        throw new Error('Image dimensions must be at least 400x400 pixels');
      }
    }

    if (req.files) {
      await Promise.all(
        req.files.map(async file => {
          const isValid = await validateDimensions(file);
          if (!isValid) {
            throw new Error('All images must be at least 400x400 pixels');
          }
        })
      );
    }

    next();
  } catch (err) {
    logger.error(`Image Validation Error: ${err.message}`);
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
};