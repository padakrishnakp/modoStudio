const User = require('../models/user');
const Order = require('../models/order');
const Cart = require('../models/cart');

const CreateOrder = async (req, res) => {
  try {
    const ip_address = req.body.ip_address;
    const { user_details } = req.body;

    let user = await User.findOne({ email: user_details.email });
    
    if (!user) {
      user = new User({
        name: user_details.name,
        phone_number: user_details.phone,
        email: user_details.email,
        delivery_address: user_details.address,
      });
      await user.save();
    }

    let cart_details = await Cart.find({ ip_address: ip_address }).lean();
    if (cart_details.length > 0) {
      const cart_items = cart_details[0].cart_items;

      const transformed_items = cart_items.map(item => ({
        product_it: item.product_id,
        quantity: item.quantity,
      }));

      const newOrder = new Order({
        ip_address: ip_address,
        product_item: transformed_items,
        order_status: 'pending',
        user_id: user._id, 
      });

     const order = await newOrder.save();
     if(order)
        {
            await Cart.deleteOne({ip_address:req.body.ip_address})


     }
      res.status(201).json({ message: "Order created successfully", order: newOrder });
    } else {
      console.log("No cart found for the given IP address.");
      res.status(404).json({ message: "No cart found for the given IP address." });
    }

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { CreateOrder };
