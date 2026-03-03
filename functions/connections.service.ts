import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import type {
  DocumentData,
  Firestore,
  QuerySnapshot,
} from "firebase/firestore";

export const createConnection = async (
  db: Firestore,
  userId: string,
  name: string,
) => {
  return addDoc(collection(db, "connections"), {
    userId,
    name,
    createdAt: new Date(),
  });
};

export const subscribeToConnections = (
  db: Firestore,
  userId: string,
  onUpdate: (snapshot: QuerySnapshot<DocumentData>) => void,
  onError?: (error: Error) => void,
) => {
  const q = query(collection(db, "connections"), where("userId", "==", userId));
  return onSnapshot(q, onUpdate, onError);
};

export const updateConnection = async (
  db: Firestore,
  id: string,
  name: string,
) => {
  const contactRef = doc(db, "connections", id);
  return updateDoc(contactRef, {
    name,
    updatedAt: new Date(),
  });
};

export const deleteConnection = async (db: Firestore, id: string) => {
  const contactRef = doc(db, "connections", id);
  return deleteDoc(contactRef);
};
