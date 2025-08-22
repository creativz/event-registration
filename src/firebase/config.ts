import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "API KEY",
  authDomain: "microsite-baac6.firebaseapp.com",
  projectId: "PROJECT ID",
  storageBucket: "microsite-baac6.firebasestorage.app",
  messagingSenderId: "SENDER ID",
  appId: "APP ID",
  measurementId: "M ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Functions with explicit region
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
export const functions = getFunctions(app, 'us-central1');

export default app;
