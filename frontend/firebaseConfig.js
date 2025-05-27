// Import only what you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgdahpuKyEiDHzAbG0Yk4xPPRYbsLfKhw",
  authDomain: "linkedpair.firebaseapp.com",
  projectId: "linkedpair",
  storageBucket: "linkedpair.firebasestorage.app",
  messagingSenderId: "862154495984",
  appId: "1:862154495984:web:007a1bad3c16b89f23ef35",
  measurementId: "G-TM9HH9K2MX",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
