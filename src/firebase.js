// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebase from 'firebase/compat/app';

// Replace with YOUR Firebase configuration from the console
const firebaseConfig = {
  
    apiKey: "AIzaSyABMIDNpua6CKY_p_Quh9jVj_UgyGY-NoA",
  authDomain: "words-398112.firebaseapp.com",
  projectId: "words-398112",
  storageBucket: "words-398112.firebasestorage.app",
  messagingSenderId: "1093141111111",
  appId: "1:1093141111111:web:12345678901234567890"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
// (Selection removed - no code needed here. The previous content was invalid JavaScript.)

firebase

