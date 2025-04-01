const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

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
const db = getFirestore(app);

// Test function to add a document
async function testAddDocument() {
  try {
    const docRef = await addDoc(collection(db, "test"), {
      message: "Test document",
      timestamp: new Date(),
    });
    console.log("Document written with ID:", docRef.id);
    return true;
  } catch (error) {
    console.error("Error adding document:", error);
    return false;
  }
}

// Run the test
testAddDocument().then((success) => {
  console.log("Test completed, success:", success);
});
