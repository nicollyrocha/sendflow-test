import { useState } from "react";
import { Button, CircularProgress, Input, Typography } from "@mui/material";
import { UiCard } from "../components/UiCard";
import { register } from "@functions/auth.service";
import { auth } from "../config/firebase";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.email || !userData.password) {
      setError("Preencha todos os campos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(auth, userData.email, userData.password);
      navigate("/login");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message || "Erro ao fazer registro");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao fazer registro");
      }
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-800 to-blue-950 h-screen flex items-center justify-center">
      <UiCard className="w-6/12 p-0">
        <div className=" flex flex-row">
          <div className="bg-gradient-to-r from-blue-700 to-blue-800 w-1/2 h-96 text-white flex flex-col items-center justify-center">
            <Typography variant="h4" className="p-4 font-bold">
              Welcome
            </Typography>
          </div>
          <form
            onSubmit={handleRegister}
            className="w-1/2 h-96 bg-gray-100 flex flex-col items-center justify-center py-10"
          >
            <Typography
              variant="h5"
              className="mb-6 font-bold pb-14"
              fontWeight={550}
            >
              Register
            </Typography>
            <Input
              placeholder="Email"
              className="mb-4 w-3/4"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
            <Input
              placeholder="Password"
              className="mb-4 w-3/4"
              type="password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
            {error && (
              <Typography variant="caption" color="error" className="mb-2">
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              className="mb-4"
              onClick={handleRegister}
              disabled={loading}
              type="submit"
            >
              {loading ? <CircularProgress size={20} /> : "Register"}
            </Button>
          </form>
        </div>
      </UiCard>
    </div>
  );
};
