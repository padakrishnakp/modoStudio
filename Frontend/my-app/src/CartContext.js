import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); 
  const [cartCount, setCartCount] = useState(0); 

  const addToCart = (product) => {
    const existingProductIndex = cartItems.findIndex(item => item.productId === product.productId);

    if (existingProductIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingProductIndex].quantity += 1; 
      setCartItems(updatedItems);
    } else {
      const newItem = { ...product, quantity: 1 }; 
      setCartItems(prevItems => [...prevItems, newItem]);
    }
    
    setCartCount(prevCount => prevCount + 1); 
  };

  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter(item => item.productId !== productId); 
    setCartItems(updatedItems);
    setCartCount(prevCount => Math.max(prevCount - 1, 0));
  };

  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
