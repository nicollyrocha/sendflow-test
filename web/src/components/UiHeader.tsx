import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { logout } from "@functions/auth.service";
import { FirebaseError } from "firebase/app";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { UiSnackBar } from "./UiSnackBar";

export const UiHeader = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (page: string) => {
    setAnchorEl(null);
    navigate(`/${page.toLowerCase()}`);
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await logout(auth);
      navigate("/login");
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(err.message || "Erro ao fazer logout");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao fazer logout");
      }
      setOpenSnackbar(true);
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError("");
  };

  return (
    <Box>
      <UiSnackBar
        open={openSnackbar}
        message={error}
        severity="error"
        onClose={handleCloseSnackbar}
      />
      <AppBar position="static" sx={{ backgroundColor: "#193cb8" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SendFlow Test
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            {loading ? <CircularProgress size={20} /> : "Logout"}
          </Button>
        </Toolbar>
      </AppBar>

      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleMenuClose("home")}>Home</MenuItem>
        <MenuItem onClick={() => handleMenuClose("messages")}>
          Messages
        </MenuItem>
      </Menu>
    </Box>
  );
};
