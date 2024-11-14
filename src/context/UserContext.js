import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../api/firebase.config'; // Ensure you have the correct path
import { fetchUserData } from './fetchUserData'; // Adjust the path

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const data = await fetchUserData(user.uid);
        setUserData(data); // Store the user data in state
      } else {
        setUserData(null); // User is not signed in
      }
    });

    return () => unsubscribe(); // Cleanup the subscription
  }, []);

  return (
    <UserContext.Provider value={{ userData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
