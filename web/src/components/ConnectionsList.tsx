import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { getConnections } from "../../../functions/connections.service";
import type { Connection } from "src/types/connection";
import { useAuth } from "../hooks/useAuth";
import { Typography } from "@mui/material";
export const ConnectionsList = () => {
  const { user } = useAuth();
  const [connectionsFromUser, setConnectionsFromUser] = useState<Connection[]>(
    [],
  );
  const getConnectionsFromUser = async () => {
    if (!user) return;
    try {
      const connections = await getConnections(db, user?.uid);
      console.log("Conexões do usuário:", connections);
      setConnectionsFromUser(
        connections.map((doc) => ({ id: doc.id, ...doc.data() }) as Connection),
      );
    } catch (error) {
      console.error("Erro ao buscar conexões:", error);
    }
  };

  useEffect(() => {
    (async () => {
      await getConnectionsFromUser();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Minhas Conexões{" "}
        <span className="text-gray-500 text-md">
          ({connectionsFromUser.length})
        </span>
      </Typography>
      {connectionsFromUser.map((connection) => (
        <div key={connection.id}>{connection.name}</div>
      ))}
    </div>
  );
};
