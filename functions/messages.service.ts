import {
  collection,
  addDoc,
  query,
  where,
  Firestore,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const createMessage = async (
  db: Firestore,
  userId: string,
  connection: { id: string; name: string },
  contacts: { id: string; name: string }[],
  content: string,
  scheduleDate: Date | null,
  status: "scheduled" | "sent",
) => {
  return addDoc(collection(db, "messages"), {
    userId,
    connection,
    contacts,
    content,
    scheduleDate,
    status,
    createdAt: new Date(),
  });
};

export const subscribeToMessages = (
  db: Firestore,
  userId: string,
  onUpdate: (snapshot: QuerySnapshot<DocumentData>) => void,
  onError?: (error: Error) => void,
) => {
  const q = query(collection(db, "messages"), where("userId", "==", userId));
  return onSnapshot(q, onUpdate, onError);
};

export const updateMessage = async (
  db: Firestore,
  messageId: string,
  data: {
    content?: string;
    scheduleDate?: Date | null;
    status?: "scheduled" | "sent";
  },
) => {
  const messageRef = doc(db, "messages", messageId);
  return updateDoc(messageRef, {
    ...data,
    updatedAt: new Date(),
  });
};

export const deleteMessage = async (db: Firestore, messageId: string) => {
  const messageRef = doc(db, "messages", messageId);
  return deleteDoc(messageRef);
};

export const processScheduledMessages = async (
  db: Firestore,
  userId?: string,
) => {
  const now = new Date();

  const q = userId
    ? query(
        collection(db, "messages"),
        where("userId", "==", userId),
        where("status", "==", "scheduled"),
      )
    : query(collection(db, "messages"), where("status", "==", "scheduled"));

  const snapshot = await getDocs(q);

  const updates = snapshot.docs
    .filter((doc) => {
      const scheduleDate = doc.data().scheduleDate;
      if (!scheduleDate) return false;
      const date = scheduleDate.toDate
        ? scheduleDate.toDate()
        : new Date(scheduleDate);
      return date <= now;
    })
    .map((doc) => updateDoc(doc.ref, { status: "sent" }));

  await Promise.all(updates);
};
