// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbu3BfcX0ceedkEGdlYjP4MgAiVasviBY",
  authDomain: "grok-project-74.firebaseapp.com",
  projectId: "grok-project-74",
  storageBucket: "grok-project-74.firebasestorage.app",
  messagingSenderId: "1070278143070",
  appId: "1:1070278143070:web:6c5eaf7e6d608ddd6c18cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);