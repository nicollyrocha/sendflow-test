import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { UiCard } from "./UiCard";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { db } from "../config/firebase";
import { createContact } from "@functions/contacts.service";
import { UiInput } from "./UiInput";
import { UiSnackBar } from "./UiSnackBar";

export const CreateContact = () => {
  const { user } = useAuth();

  const [data, setData] = useState({ name: "", tel: "" });
  const [loading, setLoading] = useState(false);
  const [snackbarInfo, setSnackbarInfo] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setLoading(true);
      createContact(db, user?.uid, data.name, data.tel).then(() => {
        setData({ name: "", tel: "" });
        setLoading(false);
        setSnackbarInfo({
          open: true,
          message: "Contato criado com sucesso!",
          severity: "success",
        });
      });
    } catch (err) {
      setSnackbarInfo({
        open: true,
        message:
          "Erro ao criar contato: " +
          (err instanceof Error ? err.message : "Erro desconhecido"),
        severity: "error",
      });
      setLoading(false);
      console.error("Erro ao criar contato:", err);
    }
  };

  return (
    <UiCard className="w-full h-64">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start justify-center pb-8 px-10 gap-2"
      >
        <Typography variant="h6" gutterBottom className="text-start pt-10 mb-0">
          Criar Contato
        </Typography>
        <Box className="flex flex-col gap-5 items-start justify-center w-full">
          <UiInput
            label="Nome do contato"
            fullWidth
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <UiInput
            label="Telefone do contato"
            fullWidth
            value={data.tel}
            inputProps={{ maxLength: 11, inputMode: "numeric" }}
            onChange={(e) =>
              setData({
                ...data,
                tel: e.target.value.replace(/\D/g, "").slice(0, 11),
              })
            }
            error={data.tel.length > 0 && data.tel.length < 11}
            helperText={
              data.tel.length > 0 && data.tel.length < 11
                ? "Número deve conter 11 dígitos"
                : ""
            }
          />
          <div className="flex w-full justify-center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              disabled={
                loading || !data.name || !data.tel || data.tel.length < 11
              }
              className="px-5"
            >
              {loading ? <CircularProgress size={20} /> : "Criar"}
            </Button>
          </div>
        </Box>
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
