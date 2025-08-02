// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDpfcw-BHUb-VrEhdf2isCrYnrcgz31n4",
  authDomain: "pixelpal-1a461.firebaseapp.com",
  projectId: "pixelpal-1a461",
  storageBucket: "pixelpal-1a461.firebasestorage.app",
  messagingSenderId: "604989917028",
  appId: "1:604989917028:web:ac891848d63196c08adc71",
  measurementId: "G-C00KWWR6N6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
