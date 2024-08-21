import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function MultiSelection({ options, value, onChange }) {
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    // Filter options to remove already selected items
    const updatedFilteredOptions = options.filter(
      (option) => !value.some((selected) => selected._id === option._id)
    );
    setFilteredOptions(updatedFilteredOptions);
  }, [options, value]);

  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        multiple
        id="employees-multiple"
        options={filteredOptions}
        getOptionLabel={(option) => option.name}
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
        isOptionEqualToValue={(option, value) => option._id === value._id}
      />
    </Stack>
  );
}
