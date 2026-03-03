import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Firestore,
  updateDoc,
  doc,
  deleteDoc,
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

export const getContacts = async (db: Firestore, userId: string) => {
  const q = query(collection(db, "contacts"), where("userId", "==", userId));

  const snapshot = await getDocs(q);

  return snapshot.docs;
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
