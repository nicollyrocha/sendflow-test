import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { env } from "process";

const firebaseConfig = {
  apiKey: env.API_KEY_FIREBASE,
  authDomain: "sendflow-test-533e0.firebaseapp.com",
  projectId: "sendflow-test-533e0",
  storageBucket: "sendflow-test-533e0.firebasestorage.app",
  messagingSenderId: "957394225743",
  appId: "1:957394225743:web:8733a3fc18ff913d1b783a",
  measurementId: "G-9892QZMX3B",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
