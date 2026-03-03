import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material/TextField";

export const UiInput = ({
  label,
  type = "text",
  multiline = false,
  ...rest
}: TextFieldProps) => {
  return (
    <TextField
      label={label}
      type={type}
      multiline={multiline}
      {...rest}
      size="small"
    />
  );
};
