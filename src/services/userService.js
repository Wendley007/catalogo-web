import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConnection";

export const updateUserRole = async (uid, newRole) => {
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, { role: newRole }, { merge: true });
};
