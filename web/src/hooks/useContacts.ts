import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  deleteContact,
  subscribeToContacts,
  updateContact,
} from "@functions/contacts.service";
import type { Contact } from "../types/contact";
import { useAuth } from "./useAuth";

interface UseContactsReturn {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  updateContact: (id: string, name: string, tel: string) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

export const useContacts = (): UseContactsReturn => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = subscribeToContacts(
      db,
      user.uid,
      (snapshot) => {
        const contacts = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Contact,
        );
        setContacts(contacts);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao buscar contatos:", err);
        setError(
          err instanceof Error ? err.message : "Erro ao buscar contatos",
        );
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const handleUpdateContact = async (id: string, name: string, tel: string) => {
    try {
      await updateContact(db, id, name, tel);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar contato";
      setError(errorMessage);
      throw err;
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteContact(db, id);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao excluir contato";
      setError(errorMessage);
      throw err;
    }
  };

  return {
    contacts,
    loading,
    error,
    updateContact: handleUpdateContact,
    deleteContact: handleDeleteContact,
  };
};
