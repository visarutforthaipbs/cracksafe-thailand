import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

// The document ID from your logs
const documentId = "22V3Lpik2c518JbHh8TZ";

// Function to get a specific document
async function getDocument(docId) {
  try {
    console.log(`Attempting to read document with ID: ${docId}`);

    const docRef = doc(db, "assessments", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}

// Run the check
getDocument(documentId).then((data) => {
  if (data) {
    console.log("Document exists and contains data");
    console.log("Fields in the document:");
    Object.keys(data).forEach((key) => {
      console.log(`  - ${key}: ${JSON.stringify(data[key])}`);
    });
  } else {
    console.log("Document does not exist or is empty");
  }
});
