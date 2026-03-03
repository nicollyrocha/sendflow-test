import { Dialog, DialogActions, Button } from "@mui/material";
import React from "react";

export const UiDialog = ({
  open,
  handleClose,
  onClickConfirm,
  children,
}: {
  open: boolean;
  handleClose: () => void;
  onClickConfirm: () => void;
  children: React.ReactNode;
}) => {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {children}
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={onClickConfirm} color="error">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
