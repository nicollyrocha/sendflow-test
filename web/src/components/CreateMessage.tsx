import { Box, Button, CircularProgress } from "@mui/material";
import { UiCard } from "./UiCard";
import { UiSelect } from "./UiSelect";
import {
  UiMultipleSelect,
  type MultipleSelectOption,
} from "./UiMultipleSelect";
import { UiInput } from "./UiInput";
import { UiDateTimePicker } from "./UiDateTimePicker";
import { useState, useMemo } from "react";
import type dayjs from "dayjs";
import { useConnections } from "../hooks/useConnections";
import { useContacts } from "../hooks/useContacts";
import { createMessage } from "@functions/messages.service";
import { db } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";
import { getConnection } from "../config/connections";
import { UiSnackBar } from "./UiSnackBar";

export const CreateMessage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<{
    message: string;
    scheduleDate: dayjs.Dayjs | null;
  }>({
    message: "",
    scheduleDate: null,
  });
  const [selectedConnection, setSelectedConnection] = useState({
    id: "",
    name: "",
  });
  const [selectedContacts, setSelectedContacts] = useState<
    MultipleSelectOption[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { connections } = useConnections();
  const { contacts } = useContacts();
  const [snackbarInfo, setSnackbarInfo] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const connectionOptions = useMemo(() => {
    return connections.map((conn) => {
      const connectionConfig = getConnection(conn.name.toLowerCase());
      return {
        value: conn.id,
        label: connectionConfig?.label || conn.name,
        iconComponent: connectionConfig?.iconComponent,
        iconClassName: connectionConfig?.iconClassName,
      };
    });
  }, [connections]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setLoading(true);
      createMessage(
        db,
        user?.uid,
        selectedConnection,
        selectedContacts
          .filter(
            (c): c is MultipleSelectOption & { id: string } =>
              c.id !== undefined,
          )
          .map((c) => ({ id: c.id, name: c.title })),
        data.message,
        data.scheduleDate ? data.scheduleDate.toDate() : null,
        data.scheduleDate ? "scheduled" : "sent",
      ).then(() => {
        setData({
          message: "",
          scheduleDate: null,
        });
        setSelectedConnection({ id: "", name: "" });
        setSelectedContacts([]);
        setLoading(false);
        setSnackbarInfo({
          open: true,
          message: data.scheduleDate
            ? "Mensagem agendada com sucesso!"
            : "Mensagem enviada com sucesso!",
          severity: "success",
        });
      });
    } catch (err) {
      setLoading(false);
      setSnackbarInfo({
        open: true,
        message: data.scheduleDate
          ? "Erro ao agendar mensagem: "
          : "Erro ao enviar mensagem: " +
            (err instanceof Error ? err.message : "Erro desconhecido"),
        severity: "error",
      });
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between w-full">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          flexShrink: 0,
        }}
      >
        <UiCard className="w-full flex flex-col items-center justify-start py-5 px-8">
          <form onSubmit={handleSubmit}>
            <Box className="flex flex-row gap-4 w-full">
              <UiSelect
                label="Conexões"
                options={connectionOptions}
                value={selectedConnection.id}
                onChange={(e) =>
                  setSelectedConnection(
                    connections.find((c) => c.id === e.target.value) || {
                      id: "",
                      name: "",
                    },
                  )
                }
              />
              <UiMultipleSelect
                label="Selecionar Contatos"
                placeholder="Selecione os contatos"
                options={contacts.map((c) => ({
                  id: c.id,
                  title: c.name,
                }))}
                value={selectedContacts}
                onChange={(value) => setSelectedContacts(value)}
              />
            </Box>
            <UiInput
              label="Mensagem"
              multiline={true}
              rows={4}
              value={data.message}
              onChange={(e) => setData({ ...data, message: e.target.value })}
              className="w-full mt-5"
              required
            />
            <div className="mt-5 flex flex-col lg:flex-row justify-between items-center">
              <UiDateTimePicker
                label="Data de Agendamento"
                value={data.scheduleDate}
                onChange={(value) => setData({ ...data, scheduleDate: value })}
              />
              <Button
                variant="contained"
                color="primary"
                className="mt-5"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !selectedConnection.id ||
                  selectedContacts.length === 0 ||
                  !data.message
                }
              >
                {loading ? <CircularProgress size={20} /> : "Enviar Mensagem"}
              </Button>
            </div>
          </form>
        </UiCard>
        <UiSnackBar
          open={snackbarInfo.open}
          message={snackbarInfo.message}
          severity={snackbarInfo.severity}
          onClose={() => setSnackbarInfo({ ...snackbarInfo, open: false })}
        />
      </Box>
    </div>
  );
};
