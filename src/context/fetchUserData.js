import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config'; // Ensure this path is correct

export const fetchUserData = async (uid) => {
  const userDoc = doc(db, 'users', uid);
  const docSnap = await getDoc(userDoc);

  if (docSnap.exists()) {
    return docSnap.data(); // Return the user data
  } else {
    console.log("No such document!");
    return null; // Return null if no document exists
  }
};
