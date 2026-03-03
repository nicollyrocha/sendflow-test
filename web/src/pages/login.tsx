import { useEffect, useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { UiCard } from "../components/UiCard";
import { login } from "@functions/auth.service";
import { auth } from "../config/firebase";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UiInput } from "../components/UiInput";
import { validateEmail } from "../utils";

export const Login = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/home", { replace: true });
    }
  }, [authLoading, user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.email || !userData.password) {
      setError("Preencha todos os campos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(auth, userData.email, userData.password);
      navigate("/home");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message || "Erro ao fazer login");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao fazer login");
      }
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-linear-to-b from-blue-800 to-blue-950 h-screen flex items-center justify-center">
      <UiCard className="md:w-6/12 p-0 border-none flex flex-row">
        <div className="flex flex-row">
          <div className="hidden bg-linear-to-r from-blue-700 to-blue-800 md:w-1/2 h-96 text-white md:flex flex-col items-center justify-center">
            <Typography variant="h4" className="p-4 font-bold">
              Welcome Back!
            </Typography>
          </div>
          <form
            onSubmit={handleSignIn}
            className="md:w-1/2 h-96 bg-gray-100 flex flex-col items-center justify-center"
          >
            <Typography
              variant="h5"
              className="mb-6 font-bold pb-10"
              fontWeight={550}
            >
              Login
            </Typography>
            <UiInput
              label="Email"
              className="mb-4 w-3/4"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              error={
                validateEmail(userData.email) === false && userData.email !== ""
              }
              helperText={
                validateEmail(userData.email) === false && userData.email !== ""
                  ? "Email inválido"
                  : ""
              }
            />
            <UiInput
              label="Password"
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
            <div className="flex flex-col">
              <Button
                variant="contained"
                color="primary"
                className="mb-4"
                disabled={loading}
                type="submit"
              >
                {loading ? <CircularProgress size={20} /> : "Login"}
              </Button>
              <Button
                variant="text"
                color="primary"
                className="mb-4"
                onClick={() => navigate("/")}
                disabled={loading}
                type="button"
              >
                Register
              </Button>
            </div>
          </form>
        </div>
      </UiCard>
    </div>
  );
};
