import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  WhereFilterOp,
  QueryConstraint,
  FieldValue,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase";

// Types
type DocumentData = {
  [key: string]: FieldValue | string | number | boolean | null | undefined;
};

// Firestore Operations
export const createDocument = async (
  collectionName: string,
  data: DocumentData
) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error creating document:", error);
    throw error;
  }
};

export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: DocumentData
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    return { id: docId, ...data };
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

export const getCollection = async (
  collectionName: string,
  conditions: QueryConstraint[] = []
) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q =
      conditions.length > 0
        ? query(collectionRef, ...conditions)
        : collectionRef;
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting collection:", error);
    throw error;
  }
};

// Storage Operations
export const uploadFile = async (
  path: string,
  file: File,
  retries = 3
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    if (retries > 0) {
      console.log(`Retrying upload... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return uploadFile(path, file, retries - 1);
    }
    throw error;
  }
};

export const deleteFile = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

// Helper functions for query conditions
export const whereCondition = (
  field: string,
  operator: WhereFilterOp,
  value: unknown
) => where(field, operator, value);

export const orderByCondition = (
  field: string,
  direction: "asc" | "desc" = "asc"
) => orderBy(field, direction);
