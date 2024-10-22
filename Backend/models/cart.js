const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  ip_address: {
    type: String,
    required: true,
  },
  cart_items: [{
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', 
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1, 
    },
  }],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
