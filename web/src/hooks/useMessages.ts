import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { subscribeToMessages } from "@functions/messages.service";
import { useAuth } from "./useAuth";
import type { Message } from "src/types/message";
import { sortByScheduleDateDesc, sortByCreatedAtDesc } from "../utils";

interface UseMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  scheduledMessages: Message[];
  sentMessages: Message[];
}

export const useMessages = (): UseMessagesReturn => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = subscribeToMessages(
      db,
      user.uid,
      (snapshot) => {
        const messages = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Message,
        );
        setMessages(messages);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao buscar mensagens:", err);
        setError(
          err instanceof Error ? err.message : "Erro ao buscar mensagens",
        );
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const scheduledMessages = sortByScheduleDateDesc(
    messages.filter((message) => message.scheduleDate !== null),
  );
  const sentMessages = sortByCreatedAtDesc(
    messages.filter((message) => message.scheduleDate === null),
  );

  return {
    messages,
    loading,
    error,
    scheduledMessages,
    sentMessages,
  };
};
