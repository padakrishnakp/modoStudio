import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar, 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCart } from '../CartContext';
import useFetch from '../CustomHooks/useFetch';
import useCreated from '../CustomHooks/useCreated'; // Import the custom hook

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
}));

const CircularThumbnail = styled(CardMedia)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  cursor: 'pointer',
  marginBottom: theme.spacing(1),
  '&:hover': {
    opacity: 0.7,
  },
}));

const ProductView = () => {
  const [productDetails, setProductDetails] = useState(null);
  const { slug } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar
  const { addToCart } = useCart();
  const { data, loading, error } = useFetch(`product/${slug}`);
  const { createCart, loading: postLoading, error: postError, responseData, apiMessage } = useCreated(); // Use the custom hook

  useEffect(() => {
    if (data) {
      setProductDetails({
        productName: data.product_name,
        productImage: data.images,
        productDescription: data.description,
        productPrice: data.price,
        productId: data._id, 
      });
    }
  }, [data]);

  const handleAddToCart = async () => {
    if (productDetails) {

      const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
      const ipAddress = data.ip; 
      const productId = productDetails.productId;

      await createCart(ipAddress, productId);

      if (responseData) {
        console.log('Cart updated:', responseData);
        addToCart(productDetails);
      } else if (postError) {
        console.error('Error adding to cart:', postError);
      }
      
      setSnackbarOpen(true); 
    }
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); 
  };

  if (loading || postLoading) {
    return <Typography variant="h5" align="center">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h5" align="center">Error fetching product: {error.message}</Typography>;
  }

  if (!productDetails) {
    return <Typography variant="h5" align="center">Product not found</Typography>;
  }

  return (
    <Grid container justifyContent="center" style={{ padding: '20px' }}>
      <StyledCard>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <CardMedia
              component="img"
              height="400"
              image={productDetails.productImage[selectedImageIndex]}
              alt={productDetails.productName}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" align="center">Thumbnails</Typography>
            {productDetails.productImage.map((image, index) => (
              index !== selectedImageIndex && (
                <CircularThumbnail
                  key={index}
                  component="img"
                  image={image}
                  alt={`Thumbnail ${index}`}
                  onClick={() => handleThumbnailClick(index)}
                />
              )
            ))}
          </Grid>
        </Grid>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>{productDetails.productName}</Typography>
          <Typography variant="h6" align="center" color="primary">${productDetails.productPrice}</Typography>

          <Button
            variant="outlined"
            color="primary"
            fullWidth
            style={{ marginBottom: '10px' }}
            onClick={handleModalOpen}
          >
            Product Details
          </Button>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </CardContent>
      </StyledCard>

      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>{productDetails.productName}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{productDetails.productDescription}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        message={apiMessage || postError || 'Cart updated successfully!'} 
      />
    </Grid>
  );
};

export default ProductView;
