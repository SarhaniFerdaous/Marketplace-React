import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAhE8x2BVeEZybkd2Bf25TJZpuXZUzOOVA",
  authDomain: "projet-web-react-e8331.firebaseapp.com",
  projectId: "projet-web-react-e8331",
  storageBucket: "projet-web-react-e8331.appspot.com",
  messagingSenderId: "231353239135",
  appId: "1:231353239135:web:1fd15a4be10586acd4bdea"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);