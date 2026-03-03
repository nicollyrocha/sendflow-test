import { Layout } from "../layouts";
import { ConnectionsList } from "../components/ConnectionsList";
import { useAuth } from "../hooks/useAuth";
import { Box, Typography } from "@mui/material";
import { CreateContact } from "../components/CreateContact";
import { ContactsList } from "../components/ContactsList";
import { CreateConnection } from "../components/CreateConnection";

export const Home = () => {
  const { user, loading } = useAuth();

  if (loading && !user) return <Layout>Carregando...</Layout>;

  return (
    <Layout>
      {user && (
        <div className="flex flex-col gap-10 w-full max-w-300 mx-auto mt-12 mb-10">
          <Box className="flex flex-col text-start">
            <Typography variant="h4" className="font-bold mb-2">
              Send<span className="text-blue-700">Flow</span>
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600">
              Gerencie suas conexões e contatos
            </Typography>
          </Box>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: {
                  xs: "100%",
                  lg: 550,
                },
                flexShrink: 0,
              }}
            >
              <CreateConnection />
              <ConnectionsList />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: {
                  xs: "100%",
                  lg: 550,
                },
                flexShrink: 0,
              }}
            >
              <CreateContact />
              <ContactsList />
            </Box>
          </div>
        </div>
      )}
    </Layout>
  );
};
