import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIbMJmrMSBM7Zpuk6SvWDNkFZxy99SJLY",
  authDomain: "cracksafe-thailand-2025.firebaseapp.com",
  projectId: "cracksafe-thailand-2025",
  storageBucket: "cracksafe-thailand-2025.firebasestorage.app",
  messagingSenderId: "274161298046",
  appId: "1:274161298046:web:20da96b3bbc558a721c62f",
  measurementId: "G-RJ981MVL1L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
