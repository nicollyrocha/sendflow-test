import { Dialog, DialogActions, Button } from "@mui/material";
import React from "react";

export const UiDialog = ({
  open,
  handleClose,
  onClickConfirm,
  children,
  disabled,
}: {
  open: boolean;
  handleClose: () => void;
  onClickConfirm: () => void;
  children: React.ReactNode;
  disabled?: boolean;
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
          <Button onClick={onClickConfirm} color="error" disabled={disabled}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
