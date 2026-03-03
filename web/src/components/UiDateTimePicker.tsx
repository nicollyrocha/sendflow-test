import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface UiDateTimePickerProps {
  label: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
}

export const UiDateTimePicker = ({
  label,
  value,
  onChange,
}: UiDateTimePickerProps) => {
  return (
    <DateTimePicker
      label={label}
      value={value}
      onChange={onChange}
      minDateTime={dayjs()}
    />
  );
};
