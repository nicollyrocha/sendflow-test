import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Firestore,
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

export const getConnections = async (db: Firestore, userId: string) => {
  const q = query(collection(db, "connections"), where("userId", "==", userId));

  const snapshot = await getDocs(q);

  return snapshot.docs;
};
