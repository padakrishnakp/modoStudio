import React, { useState, useEffect } from 'react';
import { Typography, Button, Grid, Card, CardContent, TextField, Snackbar, CardMedia } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import useFetch from '../CustomHooks/useFetch';

const Order = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data_ip = await response.json();
        setIpAddress(data_ip.ip);
      } catch (error) {
        console.error('Error fetching IP address:', error);
      }
    };

    fetchIpAddress();
  }, []);

  const { data } = useFetch(`cart/${ipAddress}`);

  useEffect(() => {
    if (data) {
      setCartData(data.cart.cart_items.map(item => ({
        productName: item.product_id.product_name,
        productPrice: item.product_id.price,
        productImage: item.product_id.images[0],
        quantity: item.quantity,
        id: item._id
      })));
    }
  }, [data]);

  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    const orderDetails = {
      ip_address: ipAddress,
      user_details: userDetails
    };

    try {
      const response = await fetch('http://localhost:3000/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderDetails)
      });

      if (response.ok) {
       await response.json();
        setSnackbarMessage('Order submitted successfully!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Failed to submit order.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setSnackbarMessage('An error occurred while submitting the order.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setLoading(false); 

      setTimeout(() => {
        navigate('/'); 
      }, 2000); 
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const getTotalPrice = () => {
    return cartData.reduce((total, item) => total + item.productPrice * item.quantity, 0).toFixed(2);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Your Order</Typography>

      <Grid container spacing={1}>
        {cartData.map((item, index) => (
          <Grid item xs={12} md={6} key={index} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card style={{ display: 'flex', justifyContent: 'space-between', width: '350px' }}>
              <CardContent style={{ flex: '1' }}>
                <Typography variant="h6">{item.productName}</Typography>
                <Typography variant="body1">Price: ${item.productPrice}</Typography>
                <Typography variant="body1">Quantity: {item.quantity}</Typography>
                <Typography variant="body1">Total: ${(item.productPrice * item.quantity).toFixed(2)}</Typography>
              </CardContent>
              <CardMedia
                component="img"
                image={item.productImage}
                alt={item.productName}
                style={{ width: '80px', height: '80px', objectFit: 'cover', margin: '10px' }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" style={{ marginTop: '20px' }}>
        Total Price: ${getTotalPrice()}
      </Typography>

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={userDetails.name}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={userDetails.phone}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={userDetails.email}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <TextField
          fullWidth
          label="Delivery Address"
          name="address"
          value={userDetails.address}
          onChange={handleChange}
          required
          multiline
          rows={4}
          style={{ marginBottom: '10px' }}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Submit Order
        </Button>
      </form>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} elevation={6} variant="filled">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Order;
