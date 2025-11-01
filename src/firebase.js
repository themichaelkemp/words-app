// src/firebase.js
// Firebase modular SDK v9+ configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABMIDNpua6CKY_p_Quh9jVj_UgyGY-NoA",
  authDomain: "words-398112.firebaseapp.com",
  projectId: "words-398112",
  storageBucket: "words-398112.firebasestorage.app",
  messagingSenderId: "1093141111111",
  appId: "1:1093141111111:web:12345678901234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };

