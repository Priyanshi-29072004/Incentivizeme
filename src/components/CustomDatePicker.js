// components/CustomDatePicker.js
import React from "react";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";

const CustomDatePicker = ({ name, label, value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value}
        onChange={(date) => onChange(date)}
        renderInput={(params) => <TextField {...params} name={name} />}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
