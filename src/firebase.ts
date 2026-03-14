import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFwB-Yt7ARcMZoPD6-1vI892PXyLEvdcU",
  authDomain: "ultragames-website.firebaseapp.com",
  projectId: "ultragames-website",
  storageBucket: "ultragames-website.firebasestorage.app",
  messagingSenderId: "71123549613",
  appId: "1:71123549613:web:8509e882fc8093a3fab524",
  measurementId: "G-TZYVTF4100"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
