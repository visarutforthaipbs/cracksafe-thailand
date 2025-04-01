import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

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

// Test function to simulate form submission
async function testCreateAssessment() {
  try {
    // Mock form data that matches your CrackAssessment structure
    const assessmentData = {
      location: "beam",
      pattern: "vertical",
      width: 2.5,
      isNew: true,
      isGrowing: false,
      dataConsent: true,
      risk: "moderate",
      message:
        "พบความเสี่ยงปานกลาง: ควรติดต่อผู้เชี่ยวชาญเพื่อตรวจสอบเพิ่มเติม",
      imageUrl: "",
      timestamp: new Date().toISOString(),
      coordinates: "13.736717,100.523186",
      createdAt: serverTimestamp(),
    };

    console.log("Attempting to save assessment data:", assessmentData);

    const docRef = await addDoc(collection(db, "assessments"), assessmentData);
    console.log("Assessment document written with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding assessment:", error);
    return null;
  }
}

// Run the test
testCreateAssessment().then((docId) => {
  if (docId) {
    console.log("Test completed successfully with document ID:", docId);
  } else {
    console.log("Test failed");
  }
});
