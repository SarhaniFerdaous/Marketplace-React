import { getAuth } from "firebase/auth";
import { db } from './firebase.config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { doc, deleteDoc } from "firebase/firestore"; 

const getUserId = () => {
  const auth = getAuth(); 
  const user = auth.currentUser; 

  if (user) {
    return user.uid; 
  } else {
    console.error("No user is currently logged in.");
    return null; 
  }
};

export const fetchUserProducts = async () => {
  const userId = getUserId(); 

  if (!userId) {
    throw new Error("User ID is missing. Please log in.");
  }

  try {
    
    const productsRef = collection(db, "products"); 
    const q = query(productsRef, where("userId", "==", userId)); 

    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ ...doc.data(), id: doc.id }); 
    });
    
    return products;
  } catch (error) {
    console.error("Error fetching user products:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  const userId = getUserId(); 

  if (!userId) {
    throw new Error("User ID is missing. Please log in.");
  }

  try {
   
    const productRef = doc(db, "products", productId); 
    await deleteDoc(productRef); 

    return true; 
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error; 
  }
};
