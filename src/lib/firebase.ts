// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-Ajdz3aWTPRSdH77wdQ9rLkwMz9q_Hv4",
  authDomain: "swiftbus-brg1c.firebaseapp.com",
  projectId: "swiftbus-brg1c",
  storageBucket: "swiftbus-brg1c.appspot.com",
  messagingSenderId: "132091541762",
  appId: "1:132091541762:web:f0535b73fa635a7511ea1b",
  databaseURL: "https://swiftbus-brg1c-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const rtdb = getDatabase(app);
const auth = getAuth(app);

export { app, db, rtdb, auth };
