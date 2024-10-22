import React, { useEffect, useState } from 'react';
import { Typography, Button, Grid, Card, CardContent, IconButton } from '@mui/material';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useFetch from '../CustomHooks/useFetch'; 

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [ipAddress, setIpAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data_ip = await response.json();
        setIpAddress(data_ip.ip); // Set IP address in state
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };

    fetchIpAddress();
  }, []);

  const { data, loading, error } = useFetch(`cart/${ipAddress}`);

  useEffect(() => {
    if (data) {
      console.log("data", data);
      setCartItems(data.cart.cart_items.map(item => ({
        productName: item.product_id.product_name,
        productPrice: item.product_id.price,
        productImage: item.product_id.images[0],
        quantity: item.quantity,
        id: item._id
      })));
    }
  }, [data]);

  const updateQuantity = async (index, delta) => {
    const itemId = cartItems[index].id;
    const newQuantity = Math.max(1, cartItems[index].quantity + delta);

    try {
      const response = await fetch(`http://localhost:3000/api/cart/${ipAddress}/item/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update item quantity');
      }

      setCartItems(prevItems => {
        const newItems = [...prevItems];
        newItems[index] = { ...newItems[index], quantity: newQuantity };
        return newItems;
      });
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const removeFromCart = async (index) => {
    const itemId = cartItems[index].id;
    console.log("Removing item with ID:", itemId);

    const delete_url = `http://localhost:3000/api/cart/${ipAddress}/item/${itemId}`;

    try {
      const deleteResponse = await fetch(delete_url, {
        method: 'DELETE',
      });

      if (!deleteResponse.ok) {
        throw new Error('Failed to delete item from cart');
      }

      setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.productPrice * item.quantity, 0).toFixed(2);
  };

  const handleProcessOrder = () => {
    navigate(`/order`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      {loading && <Typography variant="h6">Loading cart...</Typography>}
      {error && <Typography variant="h6" color="error">{error}</Typography>}
      {cartItems.length === 0 && !loading && (
        <Typography variant="h6">Your cart is empty.</Typography>
      )}
      {cartItems.length > 0 && (
        <Grid container spacing={2}>
          {cartItems.map((item, index) => (
            <Grid item xs={12} md={6} key={item.productName}>
              <Card>
                <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <Typography variant="h6">{item.productName}</Typography>
                    <Typography variant="body1">Price: ${item.productPrice}</Typography>
                    <Typography variant="body1">
                      Quantity: 
                      <Button onClick={() => updateQuantity(index, -1)}>-</Button>
                      {item.quantity}
                      <Button onClick={() => updateQuantity(index, 1)}>+</Button>
                    </Typography>
                    <Typography variant="body1">Total: ${(item.productPrice * item.quantity).toFixed(2)}</Typography>
                    <IconButton onClick={() => removeFromCart(index)} aria-label="delete">
                      <FaTrash />
                    </IconButton>
                  </div>
                  <img src={item.productImage} alt={item.productName} style={{ width: '100px', height: '100px', objectFit: 'cover', marginLeft: '16px' }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {cartItems.length > 0 && (
        <Typography variant="h5" style={{ marginTop: '20px' }}>
          Total Price: ${getTotalPrice()}
        </Typography>
      )}
      {cartItems.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '20px' }}
          onClick={handleProcessOrder}
        >
          Process Order
        </Button>
      )}
    </div>
  );
};

export default Cart;
