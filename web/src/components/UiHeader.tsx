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
import {
  Alert,
  CircularProgress,
  Snackbar,
  type SnackbarOrigin,
} from "@mui/material";

interface State extends SnackbarOrigin {
  open: boolean;
}

export const UiHeader = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [state, setState] = useState<State>({
    open: error ? true : false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, open } = state;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <Box>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        key={vertical + horizontal}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%", marginTop: "50px" }}
        >
          {error}
        </Alert>
      </Snackbar>
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
        <MenuItem onClick={handleMenuClose}>Home</MenuItem>
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
      </Menu>
    </Box>
  );
};
