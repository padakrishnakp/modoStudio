import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext'; 

const Header = () => {
  const { cartCount } = useCart(); 

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ color: 'white', textDecoration: 'none', flexGrow: 1 }}>
          Product Store
        </Typography>
        <IconButton color="inherit" component={Link} to="/cart">
          <ShoppingCartIcon />
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'red', borderRadius: '50%', padding: '2px 6px', color: 'white', fontSize: '12px' }}>
              {cartCount}
            </span>
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
