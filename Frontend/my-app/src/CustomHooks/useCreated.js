// useCreated.js
import { useState } from 'react';

const useCreated = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [apiMessage, setApiMessage] = useState(null); 

  const createCart = async (ipAddress, productId) => {
    setLoading(true);
    setError(null);
    setApiMessage(null); 
    try {
      const response = await fetch('http://localhost:3000/api/create-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ip_address: ipAddress,
          product_id: productId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create cart');
      }

      setResponseData(data);
      setApiMessage(data.message);
    } catch (err) {
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  };

  return { createCart, loading, error, responseData, apiMessage }; 
};

export default useCreated;
