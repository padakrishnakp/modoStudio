const express = require('express');
const { createdCart, getCartDetails, deleteCartItem, updateCartItemQuantity } = require('../controllers/cartController');
const router = express.Router();

router.post('/create-cart', createdCart);
router.get('/cart/:ip_address', getCartDetails);
router.delete('/cart/:ip_address/item/:item_id', deleteCartItem);
router.put('/cart/:ip_address/item/:item_id', updateCartItemQuantity);

module.exports = router;
