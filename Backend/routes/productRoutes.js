const express = require('express');
const { getAllProduct,getProductDetails } = require('../controllers/productController');
const router = express.Router();

router.get('/product-list', getAllProduct);
router.get('/product/:slug', getProductDetails);


module.exports = router;
