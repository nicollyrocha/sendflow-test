import { Box, Typography } from "@mui/material";
import { Layout } from "../layouts";
import { useEffect } from "react";
import { MessagesList } from "../components/MessagesList";
import { useAuth } from "../hooks/useAuth";
import { db } from "../config/firebase";
import { processScheduledMessages } from "@functions/messages.service";
import { CreateMessage } from "../components/CreateMessage";

export const Messages = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      processScheduledMessages(db, user.uid);
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  return (
    <Layout>
      <div className="flex flex-col gap-10 w-full max-w-300 mx-auto mt-12">
        <Box className="mt-10">
          <Typography variant="h5" className="font-bold mb-2">
            Enviar Mensagens
          </Typography>
          <Typography variant="subtitle1" className="text-gray-600">
            Envie mensagens para contatos especificos.
          </Typography>
        </Box>
        <CreateMessage />
        <MessagesList />
      </div>
    </Layout>
  );
};
