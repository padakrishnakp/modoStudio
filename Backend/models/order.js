const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  ip_address: {
    type: String,
    required: true
  },
  product_item: [
    {
      product_it: {
        type: Schema.Types.ObjectId,
        ref: 'Product', 
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      }
    }
  ],
  order_status: {
    type: String,
    required: true,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending'
  },
  user_id:{
    type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
