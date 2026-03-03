import { Autocomplete, TextField } from "@mui/material";

export interface MultipleSelectOption {
  id?: string;
  title: string;
}

export const UiMultipleSelect = ({
  options,
  value,
  onChange,
  label,
  placeholder,
}: {
  options: MultipleSelectOption[];
  value: MultipleSelectOption[];
  onChange: (value: MultipleSelectOption[]) => void;
  label: string;
  placeholder: string;
}) => {
  return (
    <Autocomplete
      className="w-full"
      multiple
      id="tags-standard"
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      isOptionEqualToValue={(option, selectedValue) =>
        option.id
          ? option.id === selectedValue.id
          : option.title === selectedValue.title
      }
      getOptionDisabled={(option) =>
        value.some((selectedValue) =>
          option.id
            ? option.id === selectedValue.id
            : option.title === selectedValue.title,
        )
      }
      getOptionLabel={(option) => option.title}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
};
