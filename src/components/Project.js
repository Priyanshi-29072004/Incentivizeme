import React, { useState, useEffect, Suspense } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableSortLabel from "@mui/material/TableSortLabel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import CustomDatePicker from "./CustomDatePicker";
import MultiSelection from "./Multiautoselection";

export const Project = () => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    _id: null,
    name: "",
    date: null,
    employees: [], // New field for multi-selection
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]); // State for multi-selection values

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/projects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setRows(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Fetch employees for the multi-selection field
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees");
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        const transformedData = data.map((employee) => ({
          ...employee,
          name: `${employee.firstName} ${employee.lastName}`,
        }));
        setEmployees(transformedData);
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(rows.map((row) => row._id));
    } else {
      setSelected([]);
    }
  };

  const handleClick = (event, id) => {
    event.stopPropagation();
    const selectedIndex = selected.indexOf(id);
    const newSelected =
      selectedIndex === -1
        ? [...selected, id]
        : [
            ...selected.slice(0, selectedIndex),
            ...selected.slice(selectedIndex + 1),
          ];
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewProject({ _id: null, name: "", date: null, employees: [] });
    setSelectedEmployees([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateProject = async () => {
    const employeeIds = selectedEmployees.map((employee) => employee._id);

    const projectData = { ...newProject, employees: employeeIds };
    const method = projectData._id ? "PUT" : "POST";
    const url = projectData._id
      ? `http://localhost:5000/api/projects/${projectData._id}`
      : "http://localhost:5000/api/projects";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error("Failed to save project");

      const savedProject = await response.json();
      setRows((prev) =>
        method === "POST"
          ? [...prev, savedProject]
          : prev.map((row) =>
              row._id === savedProject._id ? savedProject : row
            )
      );
      handleClose();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDeleteClick = async (_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${_id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete project");

      setRows((prev) => prev.filter((row) => row._id !== _id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleEditClick = (_id) => {
    const projectToEdit = rows.find((row) => row._id === _id);
    setNewProject({
      ...projectToEdit,
      date: projectToEdit.date ? new Date(projectToEdit.date) : null,
      employees: projectToEdit.employees || [], // Ensure employees are set
    });
    setSelectedEmployees(projectToEdit.employees || []); // Set selected employees for multi-selection
    setOpen(true);
  };

  return (
    <Box sx={{ height: 400, width: "100%", paddingTop: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={handleClickOpen}>
          + Create
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 750 }} size="medium">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < rows.length
                  }
                  checked={rows.length > 0 && selected.length === rows.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell
                key="name"
                sortDirection={orderBy === "name" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell
                key="date"
                sortDirection={orderBy === "date" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={orderBy === "date" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    {row.name}
                  </TableCell>
                  <TableCell>
                    {row.date
                      ? new Date(row.date).toLocaleDateString()
                      : "No Date"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(row._id);
                      }}
                      sx={{ marginRight: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(row._id);
                      }}
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
          {newProject._id ? "Edit Project" : "Create New Project"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={newProject.name}
            onChange={handleInputChange}
          />
          <CustomDatePicker
            value={newProject.date}
            onChange={(newValue) =>
              setNewProject((prev) => ({ ...prev, date: newValue }))
            }
          />
          <Suspense fallback={<div>Loading...</div>}>
            <MultiSelection
              options={employees}
              value={selectedEmployees}
              onChange={setSelectedEmployees}
            />
          </Suspense>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdateProject} color="primary">
            {newProject._id ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
