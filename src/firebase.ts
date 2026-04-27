import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFwB-Yt7ARcMZoPD6-1vI892PXyLEvdcU",
  authDomain: "ultragames-website.firebaseapp.com",
  projectId: "ultragames-website",
  storageBucket: "ultragames-website.firebasestorage.app",
  messagingSenderId: "71123549613",
  appId: "1:71123549613:web:8509e882fc8093a3fab524",
  measurementId: "G-TZYVTF4100"
};

const app = initializeApp(firebaseConfig);

// Auto-detect long polling: WebChannel fails behind some proxies/networks
// (corp firewalls, Cloudflare in some regions) → ERR_TIMED_OUT in console.
// SDK probes the connection and falls back to long polling when needed.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
