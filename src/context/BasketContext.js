import React, { createContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

// Create the BasketContext
export const BasketContext = createContext();

// Function to load basket from Firestore
const loadBasketFromFirestore = async () => {
  const user = getAuth().uid;
  if (user) {
    const db = getFirestore();
    const basketDoc = await getDoc(doc(db, 'baskets', user.uid));
    if (basketDoc.exists()) {
      return basketDoc.data().items || []; // return the basket items or an empty array if not set
    }
  }
  return [];
};

// BasketProvider component
export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  // Load basket from Firestore when the user logs in or on component mount
  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      // Fetch basket from Firestore
      loadBasketFromFirestore().then((serverBasket) => {
        setBasket(serverBasket);
        setLoading(false);
      }).catch((error) => {
        console.error("Error fetching basket from Firestore: ", error);
        setLoading(false);
      });
    } else {
      setBasket([]);
      setLoading(false);
    }
  }, [auth.currentUser]);

  // Sync the basket with Firestore when the basket state changes
  useEffect(() => {
    const user = auth.currentUser;
    if (user && basket.length > 0) {
      const basketDocRef = doc(db, 'baskets', user.uid);
      setDoc(basketDocRef, { items: basket }, { merge: true })
        .catch((error) => console.error("Error saving basket to Firestore: ", error));
    }
  }, [basket, auth.currentUser]);

  // Add item to the basket
  const addToBasket = (product, quantity) => {
    setBasket((prev) => {
      const existingProduct = prev.find((item) => item.id === product.id);
      if (existingProduct) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (itemId, delta) => {
    setBasket((prevBasket) => {
      const updatedBasket = prevBasket.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + delta } : item
      );
      return updatedBasket;
    });
  };

  // Remove item from basket
  const removeFromBasket = (id) => {
    setBasket((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear basket
  const clearBasket = () => {
    setBasket([]);
    const user = auth.currentUser;
    if (user) {
      const basketDocRef = doc(db, 'baskets', user.uid);
      setDoc(basketDocRef, { items: [] }, { merge: true }); // Clear the basket in Firestore
    }
  };

  return (
    <BasketContext.Provider
      value={{
        basket,
        loading,
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
