import { db } from "./firebase.config";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Function to add a product
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, "products"), productData);
    console.log("Product added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding product: ", error);
  }
};

// Function to get all products
export const getAllProducts = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return products;
};
