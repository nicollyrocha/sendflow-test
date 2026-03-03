import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { subscribeToConnections } from "@functions/connections.service";
import type { Connection } from "src/types/connection";
import { useAuth } from "../hooks/useAuth";
import { Box, IconButton, Typography } from "@mui/material";
import { UiCard } from "./UiCard";
import { UiDialog } from "./Dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import { UiInput } from "./UiInput";
import { useConnections } from "../hooks/useConnections";
import { getConnection } from "../config/connections";

export const ConnectionsList = () => {
  const { user } = useAuth();
  const [connectionsFromUser, setConnectionsFromUser] = useState<Connection[]>(
    [],
  );
  const [openDialog, setOpenDialog] = useState({ status: false, type: "" });
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);
  const {
    updateConnection: handleUpdateConnection,
    deleteConnection: handleDeleteConnection,
  } = useConnections();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToConnections(
      db,
      user.uid,
      (snapshot) => {
        const connections = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Connection,
        );
        setConnectionsFromUser(connections);
      },
      (error) => {
        console.error("Erro ao buscar conexões:", error);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const onClickConfirm = async () => {
    if (openDialog.type === "edit") {
      await handleUpdateConnection(
        selectedConnection!.id,
        selectedConnection!.name,
      );
    } else if (openDialog.type === "delete") {
      await handleDeleteConnection(selectedConnection!.id);
    }
    setOpenDialog({ status: false, type: "" });
  };

  return (
    <div>
      <UiDialog
        open={openDialog.status}
        handleClose={() => setOpenDialog({ status: false, type: "" })}
        onClickConfirm={onClickConfirm}
      >
        {selectedConnection && openDialog.type === "edit" && (
          <Box className="flex flex-col gap-5 items-start justify-center pb-8 px-10">
            <Typography variant="h6" className="p-5">
              Editar Conexão
            </Typography>
            <UiInput
              label="Nome da conexão"
              value={selectedConnection.name}
              onChange={(e) =>
                setSelectedConnection({
                  ...selectedConnection,
                  name: e.target.value,
                })
              }
            />
          </Box>
        )}
        {selectedConnection && openDialog.type === "delete" && (
          <Box className="flex flex-col gap-5 items-start justify-center pb-8 px-10">
            <Typography variant="h6" className="p-5">
              Excluir Conexão
            </Typography>
            <Typography variant="body1">
              Deseja realmente excluir o contato "
              {getConnection(selectedConnection.name.toLowerCase())?.label ||
                selectedConnection.name}
              "?
            </Typography>
          </Box>
        )}
      </UiDialog>
      <Typography variant="h6" gutterBottom>
        Minhas Conexões{" "}
        <span className="text-gray-500 text-md">
          ({connectionsFromUser.length})
        </span>
      </Typography>
      <div className="flex flex-col gap-2">
        {connectionsFromUser.map((connection) => {
          const connectionConfig = getConnection(connection.name.toLowerCase());
          const IconComponent = connectionConfig?.iconComponent;
          const displayName = connectionConfig?.label || connection.name;

          return (
            <UiCard key={connection.id} className="p-5">
              <Box className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                  {IconComponent && (
                    <IconComponent
                      className={connectionConfig?.iconClassName}
                    />
                  )}
                  <div className="font-semibold text-lg">{displayName}</div>
                </div>

                <div>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      setSelectedConnection(connection);
                      setOpenDialog({ status: true, type: "delete" });
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </Box>
            </UiCard>
          );
        })}
      </div>
    </div>
  );
};
