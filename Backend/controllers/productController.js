const product = require('../models/product');

const getAllProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 8; 
    const skip = (page - 1) * limit; 

    const [product_list, totalProducts] = await Promise.all([
      product.find().limit(limit).skip(skip), 
      product.countDocuments(), 
    ]);

    res.status(200).json({
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit), 
      currentPage: page,
      products: product_list,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductDetails = async (req, res) => {
    try {
      const { slug } = req.params; 
  
      const productDetail = await product.findOne({ slug }); 
  
      if (!productDetail) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json(productDetail); 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = { getAllProduct,getProductDetails };
