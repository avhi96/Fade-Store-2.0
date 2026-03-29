import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBkUW1RZ5xoZrt2fHG_TDEeIr40HijyzKo",
  authDomain: "fade-0l3.firebaseapp.com",
  projectId: "fade-0l3",
  storageBucket: "fade-0l3.firebasestorage.app",
  messagingSenderId: "157176870909",
  appId: "1:157176870909:web:19cfea635b66566250cb94",
  measurementId: "G-Y5F0QQHRMK"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
