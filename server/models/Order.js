const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity cannot be less than 1']
    },
    price: {
      type: Number,
      required: true
    },
    customizations: {
      flavor: String,
      frosting: String,
      toppings: [String],
      decorations: [String],
      message: String,
      specialInstructions: String
    }
  }],
  shippingAddress: {
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'USA'
    }
  },
  billingAddress: {
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'USA'
    }
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['stripe', 'paypal'],
      required: true
    },
    transactionId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paidAt: Date
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  delivery: {
    type: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: true
    },
    preferredDate: {
      type: Date,
      required: true
    },
    preferredTimeSlot: {
      type: String,
      required: true
    },
    actualDeliveryDate: Date,
    trackingInfo: {
      carrier: String,
      trackingNumber: String,
      estimatedDeliveryTime: Date,
      currentLocation: String,
      status: String
    },
    deliveryFee: {
      type: Number,
      default: 0
    }
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  specialInstructions: String,
  giftOptions: {
    isGift: {
      type: Boolean,
      default: false
    },
    giftMessage: String,
    giftWrapping: {
      type: Boolean,
      default: false
    }
  },
  cancellation: {
    isCancelled: {
      type: Boolean,
      default: false
    },
    reason: String,
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed', null],
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    // Generate a unique order number (YYYYMMDD-XXXX)
    const date = new Date();
    const dateStr = date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0');
    
    // Find the latest order number for today
    const latestOrder = await this.constructor.findOne({
      orderNumber: new RegExp(`^${dateStr}`)
    }).sort({ orderNumber: -1 });

    let sequence = '0001';
    if (latestOrder) {
      const latestSequence = parseInt(latestOrder.orderNumber.split('-')[1]);
      sequence = (latestSequence + 1).toString().padStart(4, '0');
    }

    this.orderNumber = `${dateStr}-${sequence}`;
  }
  next();
});

// Update timestamps
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total price
orderSchema.methods.calculateTotalPrice = function() {
  // Calculate subtotal from items
  this.pricing.subtotal = this.items.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);

  // Add tax (assuming 8% tax rate)
  this.pricing.tax = this.pricing.subtotal * 0.08;

  // Calculate final total
  this.pricing.total = 
    this.pricing.subtotal + 
    this.pricing.tax + 
    this.pricing.deliveryFee - 
    this.pricing.discount;
};

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ 'delivery.preferredDate': 1 });

module.exports = mongoose.model('Order', orderSchema);