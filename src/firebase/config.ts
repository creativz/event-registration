import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBX-on2YpGrjbcrMSvq2Ufh-QLB-A6cfBs",
  authDomain: "microsite-baac6.firebaseapp.com",
  projectId: "microsite-baac6",
  storageBucket: "microsite-baac6.firebasestorage.app",
  messagingSenderId: "423847441511",
  appId: "1:423847441511:web:9a698e91cb5f7740cb90c2",
  measurementId: "G-L0LC48507N"
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
