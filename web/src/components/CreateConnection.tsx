import { Button, CircularProgress, Typography } from "@mui/material";
import { UiCard } from "./UiCard";
import { UiSelect } from "./UiSelect";
import { createConnection } from "@functions/connections.service";
import { useAuth } from "../hooks/useAuth";
import { useState, useMemo } from "react";
import { db } from "../config/firebase";
import { getConnectionOptions } from "../config/connections";
import { useConnections } from "../hooks/useConnections";
import { UiSnackBar } from "./UiSnackBar";

export const CreateConnection = () => {
  const { user } = useAuth();
  const { connections } = useConnections();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarInfo, setSnackbarInfo] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const availableOptions = useMemo(() => {
    const existingTypes = connections.map((conn) => conn.name.toLowerCase());
    return getConnectionOptions().map((option) => ({
      ...option,
      disabled: existingTypes.includes(option.value),
    }));
  }, [connections]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setLoading(true);
      createConnection(db, user?.uid, name).then(() => {
        setName("");
        setLoading(false);
        setSnackbarInfo({
          open: true,
          message: "Conexão criada com sucesso!",
          severity: "success",
        });
      });
    } catch (err) {
      setSnackbarInfo({
        open: true,
        message:
          "Erro ao criar conexão: " +
          (err instanceof Error ? err.message : "Erro desconhecido"),
        severity: "error",
      });
      setLoading(false);
      console.error("Erro ao criar conexão:", err);
    }
  };

  return (
    <UiCard className="w-full h-64">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 items-start justify-center pb-8 px-10"
      >
        <Typography variant="h6" gutterBottom className="text-start">
          Criar Conexão
        </Typography>
        <UiSelect
          label="Conexão"
          options={availableOptions}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-center w-full">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            disabled={loading || !name}
            className="px-5"
          >
            {loading ? <CircularProgress size={20} /> : "Criar"}
          </Button>
        </div>
      </form>
      <UiSnackBar
        open={snackbarInfo.open}
        message={snackbarInfo.message}
        severity={snackbarInfo.severity}
        onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
      />
    </UiCard>
  );
};
