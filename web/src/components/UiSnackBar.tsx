import { Alert, Snackbar, type SnackbarOrigin } from "@mui/material";

export const UiSnackBar = ({
  open,
  message,
  severity = "info",
  onClose,
}: {
  open: boolean;
  message: string;
  severity?: "error" | "warning" | "info" | "success";
  onClose: () => void;
}) => {
  const vertical: SnackbarOrigin["vertical"] = "top";
  const horizontal: SnackbarOrigin["horizontal"] = "right";

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={onClose}
      key={vertical + horizontal}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%", marginTop: "50px" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
