import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function MultiSelection({ options, value, onChange }) {
  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        multiple
        id="employees-multiple"
        options={options}
        getOptionLabel={(option) => option.name} // Adjust based on your data structure
        value={value}
        onChange={(event, newValue) => onChange(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Assign Employees"
            placeholder="Select employees"
          />
        )}
        isOptionEqualToValue={(option, value) => option._id === value._id} // Adjust based on your data structure
      />
    </Stack>
  );
}
