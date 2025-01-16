import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDj7u1652Sqyb4liNozwEhB-otBaal7Uj4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "opthalmologylog.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "opthalmologylog",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "opthalmologylog.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "958666373799",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:958666373799:web:892d7d7c99c8c032d1b982"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);