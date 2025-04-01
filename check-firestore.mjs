import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firebase configuration
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
const db = getFirestore(app);

// Function to read from Firestore
async function checkFirestore() {
  try {
    console.log("Attempting to read from Firestore...");

    // Get data from assessments collection
    const querySnapshot = await getDocs(collection(db, "assessments"));

    console.log(
      `Successfully read ${querySnapshot.size} documents from Firestore`
    );

    // Print the IDs of the first 5 documents
    let count = 0;
    querySnapshot.forEach((doc) => {
      if (count < 5) {
        console.log(`Document ID: ${doc.id}`);
        count++;
      }
    });

    return true;
  } catch (error) {
    console.error("Error reading from Firestore:", error);
    return false;
  }
}

// Run the check
checkFirestore().then((success) => {
  console.log("Test completed, success:", success);
});
