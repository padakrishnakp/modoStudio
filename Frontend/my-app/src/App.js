import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './Pages/ProductList';
import ProductView from './Pages/ProductView';
import Header from './Component/Header';
import Cart from './Pages/Cart'; 
import { CartProvider } from './CartContext';
import  Order from './Pages/Order'

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:slug" element={<ProductView />} />
          <Route path="/cart" element={<Cart />} /> 
          <Route path="/order" element={<Order />} /> 

        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
