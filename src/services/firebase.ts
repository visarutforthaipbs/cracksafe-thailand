import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const createDocument = async (
  collectionName: string,
  data: DocumentData
) => {
  try {
    console.log(
      `Creating document in ${collectionName} collection with data:`,
      data
    );
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    });
    console.log(`Document created successfully with ID: ${docRef.id}`);
    return docRef;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    // Rethrow the error so the calling code can handle it
    throw error;
  }
};

export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: DocumentData
) => {
  try {
    console.log(
      `Updating document ${docId} in ${collectionName} with data:`,
      data
    );
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log(`Document ${docId} updated successfully`);
  } catch (error) {
    console.error(
      `Error updating document ${docId} in ${collectionName}:`,
      error
    );
    // Rethrow the error so the calling code can handle it
    throw error;
  }
};

export const uploadFile = async (path: string, file: File): Promise<string> => {
  try {
    console.log(`Uploading file to path: ${path}`);
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    console.log(`File uploaded successfully, URL: ${url}`);
    return url;
  } catch (error) {
    console.error(`Error uploading file to ${path}:`, error);
    throw error;
  }
};
