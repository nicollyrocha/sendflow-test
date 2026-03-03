import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { useMessages } from "../hooks/useMessages";
import { UiCard } from "./UiCard";
import { formatDateTime, isScheduledDatePast } from "../utils";
import { getConnection } from "../config/connections";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const MessagesList = () => {
  const [value, setValue] = useState(0);
  const { scheduledMessages, sentMessages, loading, error } = useMessages();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Enviadas" {...a11yProps(0)} />
          <Tab label="Agendadas" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {loading ? (
          <p>Carregando mensagens...</p>
        ) : error ? (
          <p>Erro ao carregar mensagens: {error}</p>
        ) : sentMessages.length === 0 ? (
          <p>Nenhuma mensagem encontrada.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {sentMessages.map((message) => {
              const connectionConfig = getConnection(
                message.connection.name.toLowerCase(),
              );
              const IconComponent = connectionConfig?.iconComponent;
              const displayName =
                connectionConfig?.label || message.connection.name;

              return (
                <UiCard key={message.id} className="p-5">
                  <Box className="flex flex-col items-start justify-between gap-2">
                    <div className="flex items-center gap-2 justify-between w-full">
                      <div className="flex items-center gap-2 text-lg">
                        {IconComponent && (
                          <IconComponent
                            className={connectionConfig?.iconClassName}
                          />
                        )}
                        <span>{displayName}</span>
                      </div>
                      <div className="font-semibold bg-blue-100 text-blue-700 rounded-md px-2 py-1 flex items-center text-sm">
                        Enviada
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {message.contacts.map((c) => c.name).join(", ")}
                    </div>
                    <Typography variant="subtitle1" className="text-gray-600">
                      {message.content}
                    </Typography>

                    <div className="text-xs text-gray-500">
                      Enviada em{" "}
                      {formatDateTime(message.scheduleDate || new Date())}
                    </div>
                  </Box>
                </UiCard>
              );
            })}
          </div>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {loading ? (
          <p>Carregando mensagens agendadas...</p>
        ) : error ? (
          <p>Erro ao carregar mensagens agendadas: {error}</p>
        ) : scheduledMessages.length === 0 ? (
          <p>Nenhuma mensagem agendada encontrada.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {scheduledMessages.map((message) => {
              const connectionConfig = getConnection(
                message.connection.name.toLowerCase(),
              );
              const IconComponent = connectionConfig?.iconComponent;
              const displayName =
                connectionConfig?.label || message.connection.name;

              return (
                <UiCard key={message.id} className="p-5">
                  <Box className="flex flex-col items-start justify-between gap-2">
                    <div className="flex items-center gap-2 justify-between w-full">
                      <div className="flex items-center gap-2 text-lg">
                        {IconComponent && (
                          <IconComponent
                            className={connectionConfig?.iconClassName}
                          />
                        )}
                        <span>{displayName}</span>
                      </div>
                      {isScheduledDatePast(message.scheduleDate) ? (
                        <div className="font-semibold bg-blue-100 text-blue-700 rounded-md px-2 py-1 flex items-center text-sm">
                          Enviada
                        </div>
                      ) : (
                        <div className="font-semibold bg-gray-200 text-gray-700 rounded-md px-2 py-1 flex items-center text-sm">
                          Agendada
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {message.contacts.map((c) => c.name).join(", ")}
                    </div>
                    <Typography variant="subtitle1" className="text-gray-600">
                      {message.content}
                    </Typography>

                    <div className="text-xs text-gray-500">
                      Agendada para{" "}
                      {formatDateTime(message.scheduleDate || new Date())}
                    </div>
                  </Box>
                </UiCard>
              );
            })}
          </div>
        )}
      </CustomTabPanel>
    </Box>
  );
};
