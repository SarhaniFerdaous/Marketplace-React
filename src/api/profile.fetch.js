import { getAuth } from "firebase/auth";
import { db } from './firebase.config'; // Import Firebase Firestore instance
import { collection, query, where, getDocs } from 'firebase/firestore';
import { doc, deleteDoc } from "firebase/firestore"; // Import deleteDoc to delete documents from Firestore

// Function to get the current user's ID (userId) from Firebase Authentication
const getUserId = () => {
  const auth = getAuth(); // Get Firebase Auth instance
  const user = auth.currentUser; // Get the currently authenticated user

  if (user) {
    return user.uid; // Return the user's UID
  } else {
    console.error("No user is currently logged in.");
    return null; // If no user is logged in, return null
  }
};

// Function to fetch products for a user by their ID (retrieved from Firebase)
export const fetchUserProducts = async () => {
  const userId = getUserId(); // Get the userId from Firebase Authentication

  if (!userId) {
    throw new Error("User ID is missing. Please log in.");
  }

  try {
    // Query Firestore to get the products for the logged-in user
    const productsRef = collection(db, "products"); // Replace "products" with your collection name
    const q = query(productsRef, where("userId", "==", userId)); // Query for products belonging to the user

    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ ...doc.data(), id: doc.id }); // Store each product with its Firestore document ID
    });
    
    return products; // Return the list of products
  } catch (error) {
    console.error("Error fetching user products:", error);
    throw error;
  }
};

// Function to delete a product by its ID
export const deleteProduct = async (productId) => {
  const userId = getUserId(); // Get the userId from Firebase Authentication

  if (!userId) {
    throw new Error("User ID is missing. Please log in.");
  }

  try {
    // Delete the product from Firestore using its ID
    const productRef = doc(db, "products", productId); // Get a reference to the product document
    await deleteDoc(productRef); // Delete the document from Firestore

    return true; // Successfully deleted
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error; // Re-throw the error for further handling
  }
};
