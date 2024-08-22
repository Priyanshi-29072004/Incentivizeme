import React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";

const DateTimePickerComponent = ({ value, onChange, label }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        renderInput={(params) => <TextField {...params} fullWidth />}
        value={value || null}
        onChange={onChange}
        label={label}
      />
    </LocalizationProvider>
  );
};

export default DateTimePickerComponent;
