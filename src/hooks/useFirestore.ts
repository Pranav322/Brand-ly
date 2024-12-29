import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export function useFirestore<T extends DocumentData>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Fetch all documents for the current user
  const fetchData = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, collectionName),
        where("createdBy", "==", currentUser?.uid),
      );
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as unknown as T,
      );
      setData(documents);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new document
  const addDocument = async (data: Omit<T, "id">) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdBy: currentUser?.uid,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (err) {
      setError("Failed to add document");
      console.error(err);
      throw err;
    }
  };

  // Update a document
  const updateDocument = async (id: string, data: Partial<T>) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError("Failed to update document");
      console.error(err);
      throw err;
    }
  };

  // Delete a document
  const deleteDocument = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      setError("Failed to delete document");
      console.error(err);
      throw err;
    }
  };

  // Search documents
  const searchDocuments = async (field: keyof T, searchTerm: string) => {
    try {
      setLoading(true);
      const q = query(
        collection(db, collectionName),
        where("createdBy", "==", currentUser?.uid),
        where(field as string, ">=", searchTerm),
        where(field as string, "<=", searchTerm + "\uf8ff"),
      );
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as unknown as T,
      );
      setData(documents);
    } catch (err) {
      setError("Failed to search documents");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  return {
    data,
    loading,
    error,
    addDocument,
    updateDocument,
    deleteDocument,
    searchDocuments,
    refreshData: fetchData,
  };
}
