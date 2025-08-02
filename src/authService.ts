import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// Sign in with Google and store user info in Firestore
export async function signInWithGoogleAndStoreUser() {
  const provider = new GoogleAuthProvider();
  let userCredential: UserCredential;
  try {
    userCredential = await signInWithPopup(auth, provider);
  } catch (error) {
    throw new Error("Google sign-in failed: " + error);
  }

  const user = userCredential.user;
  if (!user) throw new Error("No user returned from sign-in");

  // Prepare user data
  const userData = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    lastLogin: new Date().toISOString(),
  };

  // Store or update user info in Firestore
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, userData);
  } else {
    await setDoc(userRef, { ...userSnap.data(), lastLogin: userData.lastLogin }, { merge: true });
  }

  return userData;
}

// Sign out the current user
export async function signOutUser() {
  try {
    await auth.signOut();
  } catch (error) {
    throw new Error("Sign out failed: " + error);
  }
}
