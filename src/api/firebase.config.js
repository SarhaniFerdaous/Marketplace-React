import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAhE8x2BVeEZybkd2Bf25TJZpuXZUzOOVA",
  authDomain: "projet-web-react-e8331.firebaseapp.com",
  projectId: "projet-web-react-e8331",
  storageBucket: "projet-web-react-e8331.appspot.com",
  messagingSenderId: "231353239135",
  appId: "1:231353239135:web:1fd15a4be10586acd4bdea"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, app };