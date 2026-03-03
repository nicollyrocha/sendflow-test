import {
  collection,
  addDoc,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import type {
  DocumentData,
  Firestore,
  QuerySnapshot,
} from "firebase/firestore";

export const createContact = async (
  db: Firestore,
  userId: string,
  name: string,
  tel: string,
) => {
  return addDoc(collection(db, "contacts"), {
    userId,
    name,
    tel,
    createdAt: new Date(),
  });
};

export const subscribeToContacts = (
  db: Firestore,
  userId: string,
  onUpdate: (snapshot: QuerySnapshot<DocumentData>) => void,
  onError?: (error: Error) => void,
) => {
  const q = query(collection(db, "contacts"), where("userId", "==", userId));
  return onSnapshot(q, onUpdate, onError);
};

export const updateContact = async (
  db: Firestore,
  contactId: string,
  name: string,
  tel: string,
) => {
  const contactRef = doc(db, "contacts", contactId);
  return updateDoc(contactRef, {
    name,
    tel,
    updatedAt: new Date(),
  });
};

export const deleteContact = async (db: Firestore, contactId: string) => {
  const contactRef = doc(db, "contacts", contactId);
  return deleteDoc(contactRef);
};
