import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from './firebase.config'; 

const productCollection = collection(db, 'products');

const userCollection = collection(db, 'users');

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(productCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting products:', error);
  }
};

export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(userCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting users:', error);
  }
};

export const addProduct = async (product) => {
  try {
    await addDoc(productCollection, product);
  } catch (error) {
    console.error('Error adding product:', error);
  }
};

export const addUser = async (user) => {
  try {
    await addDoc(userCollection, user);
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

export const updateProduct = async (productId, updatedData) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, updatedData);
  } catch (error) {
    console.error('Error updating product:', error);
  }
};

export const updateUser = async (userId, updatedData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updatedData);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

export const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};
