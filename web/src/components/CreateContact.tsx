import {
  Box,
  Button,
  CircularProgress,
  Input,
  Typography,
} from "@mui/material";
import { UiCard } from "./UiCard";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { db } from "../config/firebase";
import { createContact } from "@functions/contacts.service";

export const CreateContact = () => {
  const { user } = useAuth();

  const [data, setData] = useState({ name: "", tel: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setLoading(true);
      createContact(db, user?.uid, data.name, data.tel).then(() => {
        setData({ name: "", tel: "" });
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      console.error("Erro ao criar contato:", err);
    }
  };
  return (
    <UiCard className="w-full h-56">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start justify-center pb-8 px-10 gap-2"
      >
        <Typography variant="h6" gutterBottom className="text-start pt-10 mb-0">
          Criar Contato
        </Typography>
        <Box className="flex flex-col gap-5 items-start justify-center w-full">
          <Input
            placeholder="Nome do contato"
            fullWidth
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <Input
            placeholder="Telefone do contato"
            fullWidth
            value={data.tel}
            inputProps={{ maxLength: 11, inputMode: "numeric" }}
            onChange={(e) =>
              setData({
                ...data,
                tel: e.target.value.replace(/\D/g, "").slice(0, 11),
              })
            }
          />
          <div className="flex w-full justify-center">
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
        </Box>
      </form>
    </UiCard>
  );
};
