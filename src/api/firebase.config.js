import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore,collection, getDocs, addDoc, updateDoc, deleteDoc, doc,  query,  where,  orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhE8x2BVeEZybkd2Bf25TJZpuXZUzOOVA",
  authDomain: "projet-web-react-e8331.firebaseapp.com",
  projectId: "projet-web-react-e8331",
  storageBucket: "projet-web-react-e8331.appspot.com",
  messagingSenderId: "231353239135",
  appId: "1:231353239135:web:1fd15a4be10586acd4bdea"
};


const app = initializeApp(firebaseConfig);


const analytics = getAnalytics(app);
const auth = getAuth(app); 
const db = getFirestore(app); 
const storage = getStorage(app); 

export { 
  auth, 
  db, 
  storage, collection,  getDocs, addDoc,updateDoc,deleteDoc,  doc,  query, where, orderBy,  ref,  uploadBytes,  getDownloadURL,  app };
