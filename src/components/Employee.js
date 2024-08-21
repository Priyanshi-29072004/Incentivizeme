import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export const Employee = () => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    _id: null,
    firstName: "",
    lastName: "",

    hourlyRate: "",
    dateOfJoining: null, // Initialize with null or a default date
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees");
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewEmployee({
      _id: null,
      firstName: "",
      lastName: "",

      hourlyRate: "",
      dateOfJoining: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setNewEmployee({
      ...newEmployee,
      dateOfJoining: date,
    });
  };

  const handleAddEmployee = async () => {
    if (newEmployee._id) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/employees/${newEmployee._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newEmployee),
          }
        );

        if (response.ok) {
          const updatedEmployee = await response.json();
          setRows(
            rows.map((row) =>
              row._id === updatedEmployee._id ? updatedEmployee : row
            )
          );
        } else {
          console.error("Failed to update employee");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        const response = await fetch("http://localhost:5000/api/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEmployee),
        });

        if (response.ok) {
          const savedEmployee = await response.json();
          setRows([...rows, savedEmployee]);
        } else {
          console.error("Failed to add employee");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    handleClose();
  };

  const handleDeleteClick = async (_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setRows(rows.filter((row) => row._id !== _id));
      } else {
        console.error("Failed to delete employee");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditClick = (_id) => {
    const employeeToEdit = rows.find((row) => row._id === _id);
    setNewEmployee({
      ...employeeToEdit,
      dateOfJoining: employeeToEdit.dateOfJoining
        ? new Date(employeeToEdit.dateOfJoining)
        : null,
    });
    setOpen(true);
  };

  return (
    <Box sx={{ height: 400, width: "100%", paddingTop: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={handleClickOpen}>
          +Create
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size="medium"
        >
          <TableHead>
            <TableRow>
              <TableCell
                key="firstName"
                sortDirection={orderBy === "firstName" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "firstName"}
                  direction={orderBy === "firstName" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "firstName")}
                >
                  First Name
                </TableSortLabel>
              </TableCell>
              <TableCell
                key="lastName"
                sortDirection={orderBy === "lastName" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "lastName"}
                  direction={orderBy === "lastName" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "lastName")}
                >
                  Last Name
                </TableSortLabel>
              </TableCell>

              <TableCell key="hourlyRate">Hourly Rate</TableCell>
              <TableCell key="dateOfJoining">Date of Joining</TableCell>
              <TableCell key="actions">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const isItemSelected = isSelected(row._id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row._id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row._id}
                  selected={isItemSelected}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    {row.firstName}
                  </TableCell>
                  <TableCell>{row.lastName}</TableCell>
                  <TableCell>{row.hourlyRate || "0"}</TableCell>
                  <TableCell>
                    {row.dateOfJoining
                      ? new Date(row.dateOfJoining).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                          }
                        )
                      : ""}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditClick(row._id)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDeleteClick(row._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {newEmployee._id ? "Edit Employee" : "Add Employee"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              name="firstName"
              label="First Name"
              fullWidth
              variant="outlined"
              value={newEmployee.firstName}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              name="lastName"
              label="Last Name"
              fullWidth
              variant="outlined"
              value={newEmployee.lastName}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              name="hourlyRate"
              label="Hourly Rate"
              type="number"
              fullWidth
              variant="outlined"
              value={newEmployee.hourlyRate || ""}
              onChange={handleInputChange}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Joining"
                value={newEmployee.dateOfJoining}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddEmployee}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
