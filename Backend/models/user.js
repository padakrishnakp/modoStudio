const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true, 
    trim: true 
  },
  phone_number: {
    type: String,
    required: true, 
    trim: true 
  },
  email: {
    type: String,
    required: true, 
    lowercase: true, 
    trim: true, 
  },
  delivery_address: {
    type: String,
    required: true, 
    trim: true 
  }
}, { timestamps: true }); 

module.exports = mongoose.model('User', userSchema);
