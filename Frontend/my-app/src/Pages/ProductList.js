// ProductList.js
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Pagination,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import useFetch from '../CustomHooks/useFetch'; 

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'border 0.3s ease',
  border: '2px solid transparent',
  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
  },
}));

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Add state for products and totalPages
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const { data, loading, error } = useFetch(`/product-list?page=${currentPage}&limit=${limit}&search=${searchQuery}&sort=${sortOrder}`);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.products) {
      setProducts(data.products);
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    setCurrentPage(1);
  };

  const handleBuyNow = (slug) => {
    navigate(`/product/${slug}`);
  };

  if (loading) {
    return <Typography variant="h5" align="center">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="h5" align="center">Error fetching products: {error}</Typography>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Grid container spacing={3}>
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StyledCard>
              <CardMedia
                component="img"
                height="200"
                image={product.images[0]}
                alt={product.product_name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.product_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${product.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleBuyNow(product.slug)}>
                  Buy Now
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
};

export default ProductList;
