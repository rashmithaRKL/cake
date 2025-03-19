const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please specify the product category'],
    enum: {
      values: ['birthday', 'wedding', 'custom', 'party-decorations', 'cake-tools'],
      message: 'Please select a valid category'
    }
  },
  subCategory: {
    type: String,
    required: false
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    altText: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  specifications: {
    servings: {
      type: Number,
      required: function() {
        return ['birthday', 'wedding', 'custom'].includes(this.category);
      }
    },
    size: {
      type: String,
      required: function() {
        return ['birthday', 'wedding', 'custom'].includes(this.category);
      }
    },
    weight: {
      type: Number,
      required: function() {
        return ['birthday', 'wedding', 'custom'].includes(this.category);
      }
    },
    ingredients: [{
      type: String
    }],
    allergens: [{
      type: String
    }],
    customizable: {
      type: Boolean,
      default: false
    }
  },
  stock: {
    type: Number,
    required: [true, 'Please specify the stock quantity'],
    min: [0, 'Stock cannot be negative']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  ratings: {
    average: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true,
      maxlength: [500, 'Review cannot be more than 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  customizationOptions: {
    flavors: [{
      name: String,
      price: Number
    }],
    frostings: [{
      name: String,
      price: Number
    }],
    toppings: [{
      name: String,
      price: Number
    }],
    decorations: [{
      name: String,
      price: Number
    }],
    messages: {
      available: Boolean,
      maxLength: Number,
      price: Number
    }
  },
  preparationTime: {
    type: Number, // in hours
    required: function() {
      return ['birthday', 'wedding', 'custom'].includes(this.category);
    }
  },
  deliveryOptions: {
    pickup: {
      available: Boolean,
      locations: [{
        address: String,
        coordinates: {
          lat: Number,
          lng: Number
        }
      }]
    },
    delivery: {
      available: Boolean,
      fee: Number,
      minDistance: Number,
      maxDistance: Number
    }
  },
  tags: [{
    type: String
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from name
productSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Update timestamps
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.ratings.average = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.ratings.count = this.reviews.length;
  }
};

// Virtual populate orders
productSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'items.product',
  justOne: false
});

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ slug: 1 });

module.exports = mongoose.model('Product', productSchema);