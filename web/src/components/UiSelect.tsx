import { FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { ReactNode, ComponentType } from "react";

export const UiSelect = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: {
    value: string;
    label: string;
    icon?: ReactNode;
    iconComponent?: ComponentType<{ className?: string }>;
    iconClassName?: string;
    disabled?: boolean;
  }[];
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label={label}
        onChange={onChange}
        className="w-full"
      >
        {options.map((option) => {
          const IconComponent = option.iconComponent;
          const hasIcon = option.icon || IconComponent;

          return (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {hasIcon ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {IconComponent ? (
                    <IconComponent className={option.iconClassName} />
                  ) : (
                    option.icon
                  )}
                  <span>{option.label}</span>
                </Box>
              ) : (
                option.label
              )}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
