import React, { createContext, useState, useEffect } from 'react';

// Create the BasketContext
export const BasketContext = createContext();

// BasketProvider component
export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);

  // Load basket from localStorage on initial render
  useEffect(() => {
    const savedBasket = localStorage.getItem("basket");
    if (savedBasket) {
      setBasket(JSON.parse(savedBasket));
    }
  }, []);

  // Save basket to localStorage whenever it changes
  useEffect(() => {
    if (basket.length > 0) {
      localStorage.setItem("basket", JSON.stringify(basket));
    }
  }, [basket]);

  const addToBasket = (product, quantity) => {
    setBasket((prev) => {
      const existingProduct = prev.find(item => item.id === product.id);
      if (existingProduct) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const updateQuantity = (itemId, delta) => {
    setBasket((prevBasket) => {
      const updatedBasket = prevBasket.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + delta } : item
      );
      return updatedBasket;
    });
  };
  

  const removeFromBasket = (id) => {
    setBasket((prev) => prev.filter((item) => item.id !== id));
  };

  const clearBasket = () => {
    setBasket([]);
  };

  return (
    <BasketContext.Provider
      value={{
        basket,
        addToBasket,
        updateQuantity,
        removeFromBasket,
        clearBasket,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};
