import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

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

// Function to write a test assessment to Firestore
async function writeTestAssessment() {
  try {
    console.log("Attempting to write test assessment to Firestore...");

    // Test assessment data
    const testData = {
      location: "test-location",
      pattern: "test-pattern",
      width: 999,
      isNew: true,
      isGrowing: true,
      dataConsent: true,
      risk: "test-risk",
      message: "This is a test message",
      imageUrl: "https://example.com/test.jpg",
      timestamp: Timestamp.now(),
      coordinates: "0,0",
      testField:
        "This is a test document created on " + new Date().toISOString(),
    };

    // Write to assessments collection
    const docRef = await addDoc(collection(db, "assessments"), testData);
    console.log("Test assessment written with ID:", docRef.id);

    return docRef.id;
  } catch (error) {
    console.error("Error writing test assessment:", error);
    return null;
  }
}

// Run the test
writeTestAssessment().then((docId) => {
  if (docId) {
    console.log("Test completed successfully with document ID:", docId);
    console.log(
      "Please check the Firestore console to verify the document was created."
    );
  } else {
    console.log("Test failed");
  }
});
