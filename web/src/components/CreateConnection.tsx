import { Button, CircularProgress, Input, Typography } from "@mui/material";
import { UiCard } from "./UiCard";
import { createConnection } from "@functions/connections.service";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { db } from "../config/firebase";

export const CreateConnection = () => {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setLoading(true);
      createConnection(db, user?.uid, name).then(() => {
        setName("");
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      console.error("Erro ao criar conexão:", err);
    }
  };
  return (
    <UiCard className="w-full h-56">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 items-start justify-center pb-8 px-10"
      >
        <Typography variant="h6" gutterBottom className="text-start">
          Criar Conexão
        </Typography>
        <Input
          placeholder="Nome da conexão"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-center w-full">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            disabled={loading}
            className="px-5"
          >
            {loading ? <CircularProgress size={20} /> : "Criar"}
          </Button>
        </div>
      </form>
    </UiCard>
  );
};
