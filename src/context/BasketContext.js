import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Create the BasketContext
export const BasketContext = createContext();

// Function to load basket from Firestore
const loadBasketFromFirestore = async (uid) => {
  if (!uid) return []; // If no UID, return an empty basket
  const db = getFirestore();
  const basketDoc = await getDoc(doc(db, 'baskets', uid));
  if (basketDoc.exists()) {
    return basketDoc.data().items || []; // Return the basket items or an empty array if not set
  }
  return [];
};

// BasketProvider component
export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]); // Current user's basket
  const [loading, setLoading] = useState(true); // Loading state
  const auth = getAuth(); // Firebase auth instance
  const db = getFirestore(); // Firestore instance

  // Load basket when user logs in or logs out
  useEffect(() => {
    let isMounted = true; // To handle cleanup properly

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Load basket from Firestore for the logged-in user
          const serverBasket = await loadBasketFromFirestore(user.uid);
          if (isMounted) {
            setBasket(serverBasket);
          }
        } catch (error) {
          console.error("Error fetching basket from Firestore:", error);
        }
      } else {
        // Clear basket when logged out
        if (isMounted) {
          setBasket([]);
        }
      }
      if (isMounted) {
        setLoading(false); // Stop the loading spinner
      }
    });

    // Cleanup subscription
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [auth]);

  // Sync the basket with Firestore when the basket state changes
  useEffect(() => {
    const user = auth.currentUser; // Get the current user
    if (user) {
      const basketDocRef = doc(db, 'baskets', user.uid);
      setDoc(basketDocRef, { items: basket }, { merge: true }).catch((error) =>
        console.error("Error saving basket to Firestore:", error)
      );
    }
  }, [basket, auth, db]);

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
    setBasket((prevBasket) =>
      prevBasket.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + delta } : item
      )
    );
  };

  // Remove item from the basket
  const removeFromBasket = (id) => {
    setBasket((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear the basket
  const clearBasket = () => {
    setBasket([]);
    const user = auth.currentUser;
    if (user) {
      const basketDocRef = doc(db, 'baskets', user.uid);
      setDoc(basketDocRef, { items: [] }, { merge: true }).catch((error) =>
        console.error("Error clearing basket in Firestore:", error)
      );
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
