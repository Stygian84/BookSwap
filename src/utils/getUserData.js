import { firestore } from "../firebase";
import { doc, updateDoc, collection, getDoc } from "firebase/firestore";

async function getUserData(uid) {
  const userDocRef = doc(collection(firestore, "users"), uid);
  const userDocSnapshot = await getDoc(userDocRef);
  if (userDocSnapshot.exists()) {
    const userData = userDocSnapshot.data();
    if (!userData.rating) {
      // If rating field does not exist, update the document
      await updateDoc(userDocRef, { rating: 0.0 });
      userData.rating = 0.0;
    }
    return userData;
  }
  return null;
}

export default getUserData;
