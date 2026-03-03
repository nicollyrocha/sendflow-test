import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import {
  deleteConnection,
  subscribeToConnections,
  updateConnection,
} from "@functions/connections.service";
import type { Connection } from "../types/connection";
import { useAuth } from "./useAuth";

interface UseConnectionsReturn {
  connections: Connection[];
  loading: boolean;
  error: string | null;
  updateConnection: (id: string, name: string) => Promise<void>;
  deleteConnection: (id: string) => Promise<void>;
}

export const useConnections = (): UseConnectionsReturn => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = subscribeToConnections(
      db,
      user.uid,
      (snapshot) => {
        const connections = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Connection,
        );
        setConnections(connections);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao buscar conexões:", err);
        setError(
          err instanceof Error ? err.message : "Erro ao buscar conexões",
        );
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const handleUpdateConnection = async (id: string, name: string) => {
    try {
      await updateConnection(db, id, name);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar conexão";
      setError(errorMessage);
      throw err;
    }
  };

  const handleDeleteConnection = async (id: string) => {
    try {
      await deleteConnection(db, id);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao excluir conexão";
      setError(errorMessage);
      throw err;
    }
  };

  return {
    connections,
    loading,
    error,
    updateConnection: handleUpdateConnection,
    deleteConnection: handleDeleteConnection,
  };
};
