const Cart = require('../models/cart');

const createdCart = async (req, res) => {
  try {
    const { ip_address, product_id } = req.body;

    if (!ip_address || !product_id) {
      return res.status(400).json({ message: 'ip_address and product_id are required.' });
    }

    console.log("Request body:", req.body);

    let cart = await Cart.findOne({ ip_address });
    if (cart) {
      const existingProductIndex = cart.cart_items.findIndex(item => item.product_id.toString() === product_id);
      if (existingProductIndex !== -1) {
        return res.status(409).json({ message: 'You have already added this product to your cart.' });
      } else {
        cart.cart_items.push({ product_id, quantity: 1 });
        await cart.save();
        return res.status(200).json({ message: 'New product added to your cart.', cart });
      }
    } else {
      cart = new Cart({
        ip_address,
        cart_items: [{ product_id, quantity: 1 }]
      });
      await cart.save();
      return res.status(201).json({ message: 'Cart created and product added to your cart.', cart });
    }
  } catch (error) {
    console.error('Error creating cart:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getCartDetails = async (req, res) => {
    try {
      const { ip_address } = req.params;  
      if (!ip_address) {
        return res.status(400).json({ message: 'ip_address is required.' });
      }
      const cart = await Cart.findOne({ ip_address }).populate('cart_items.product_id', 'product_name price images');
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found for this IP address.' });
      }
      return res.status(200).json({ cart });
    } catch (error) {
      console.error('Error retrieving cart details:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  const deleteCartItem = async (req, res) => {
    try {
      const { ip_address, item_id } = req.params;
  
      if (!ip_address || !item_id) {
        return res.status(400).json({ message: 'ip_address and item_id are required.' });
      }
  
      const cart = await Cart.findOne({ ip_address });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found for this IP address.' });
      }
  
      const itemIndex = cart.cart_items.findIndex(item => item._id.toString() === item_id);
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in the cart.' });
      }
  
      cart.cart_items.splice(itemIndex, 1);
      
      await cart.save();
  
      return res.status(200).json({ message: 'Item removed from the cart.', cart });
    } catch (error) {
      console.error('Error deleting cart item:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
  

  const updateCartItemQuantity = async (req, res) => {
    try {
      const { ip_address, item_id } = req.params; // Change to get from params
      const { quantity } = req.body; // Quantity should come from the request body
  
      if (!ip_address || !item_id || quantity === undefined) {
        return res.status(400).json({ message: 'ip_address, item_id, and quantity are required.' });
      }
  
      const cart = await Cart.findOne({ ip_address });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found for this IP address.' });
      }
  
      const itemIndex = cart.cart_items.findIndex(item => item._id.toString() === item_id);
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in the cart.' });
      }
  
      // Update the quantity
      cart.cart_items[itemIndex].quantity = Math.max(1, quantity); // Ensure quantity is at least 1
  
      await cart.save();
  
      return res.status(200).json({ message: 'Item quantity updated successfully.', cart });
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

module.exports = { createdCart,getCartDetails,deleteCartItem,updateCartItemQuantity };
