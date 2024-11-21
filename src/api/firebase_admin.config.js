import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from './firebase.config'; 

// Product Collection reference
const productCollection = collection(db, 'products');
// User Collection reference
const userCollection = collection(db, 'users');

// Fetch Products
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(productCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting products:', error);
  }
};

// Fetch Users
export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(userCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting users:', error);
  }
};

// Add Product
export const addProduct = async (product) => {
  try {
    await addDoc(productCollection, product);
  } catch (error) {
    console.error('Error adding product:', error);
  }
};

// Add User
export const addUser = async (user) => {
  try {
    await addDoc(userCollection, user);
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

// Update Product
export const updateProduct = async (productId, updatedData) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, updatedData);
  } catch (error) {
    console.error('Error updating product:', error);
  }
};

// Update User
export const updateUser = async (userId, updatedData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updatedData);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

// Delete Product
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

// Delete User
export const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};
