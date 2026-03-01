import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyChCKHJNjmaCpqrHDQ9X9K5a-XqzTdVqSY",
  authDomain: "marseoul-65f46.firebaseapp.com",
  projectId: "marseoul-65f46",
  storageBucket: "marseoul-65f46.firebasestorage.app",
  messagingSenderId: "571093867214",
  appId: "1:571093867214:web:7d85d7227c9d7559c6ce9f",
  measurementId: "G-VQDM1YM615"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Increase retry timeout to 5 minutes for slow connections
storage.maxOperationRetryTime = 300000;
storage.maxUploadRetryTime = 300000;
