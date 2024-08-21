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
import TableSortLabel from "@mui/material/TableSortLabel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import CustomDatePicker from "./CustomDatePicker";
import MultiautoSelection from "./Multiautoselection";

export const Project = () => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    _id: null,
    name: "",
    startDate: null,
    endDate: null,
    estimatedCompletionDate: null,
    employees: [],
    status: "pending",
    bonus: 0,
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);

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
        setFilteredEmployees(transformedData || []);
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
    setNewProject({
      _id: null,
      name: "",
      startDate: null,
      endDate: null,
      estimatedCompletionDate: null,
      employees: [],
      status: "pending",
      bonus: 0,
    });
    setSelectedEmployees([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateProject = async () => {
    const employeeIds = selectedEmployees.map((employee) => employee._id);
    const { endDate, ...projectDataWithoutEndDate } = newProject; // Exclude endDate
    const projectData = {
      ...projectDataWithoutEndDate,
      employees: employeeIds,
    };
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
      startDate: projectToEdit.startDate
        ? new Date(projectToEdit.startDate)
        : null,
      endDate: projectToEdit.endDate ? new Date(projectToEdit.endDate) : null,
      estimatedCompletionDate: projectToEdit.estimatedCompletionDate
        ? new Date(projectToEdit.estimatedCompletionDate)
        : null,
      employees: projectToEdit.employees || [],
      status: projectToEdit.status || "pending",
      bonus: projectToEdit.bonus || 0,
    });
    setSelectedEmployees(projectToEdit.employees || []);
    const selectedEmployeeIds = projectToEdit.employees.map(
      (selected) => selected._id
    );

    const filteredEmployees = employees.filter(
      (employee) => !selectedEmployeeIds.includes(employee._id)
    );
    setFilteredEmployees(filteredEmployees || []);
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
                key="startDate"
                sortDirection={orderBy === "startDate" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "startDate"}
                  direction={orderBy === "startDate" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "startDate")}
                >
                  Start Date
                </TableSortLabel>
              </TableCell>
              <TableCell
                key="endDate"
                sortDirection={orderBy === "endDate" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "endDate"}
                  direction={orderBy === "endDate" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "endDate")}
                >
                  End Date
                </TableSortLabel>
              </TableCell>
              <TableCell
                key="estimatedCompletionDate"
                sortDirection={
                  orderBy === "estimatedCompletionDate" ? order : false
                }
              >
                <TableSortLabel
                  active={orderBy === "estimatedCompletionDate"}
                  direction={
                    orderBy === "estimatedCompletionDate" ? order : "asc"
                  }
                  onClick={(event) =>
                    handleRequestSort(event, "estimatedCompletionDate")
                  }
                >
                  Estimated Completion Date
                </TableSortLabel>
              </TableCell>
              <TableCell
                key="status"
                sortDirection={orderBy === "status" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={(event) => handleRequestSort(event, "status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isItemSelected = isSelected(row._id);
              const labelId = `enhanced-table-checkbox-${isItemSelected}`;

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
                    {row.name}
                  </TableCell>
                  <TableCell>
                    {row.startDate
                      ? new Date(row.startDate).toLocaleDateString()
                      : "No Start Date"}
                  </TableCell>
                  <TableCell>
                    {row.endDate
                      ? new Date(row.endDate).toLocaleDateString()
                      : "No End Date"}
                  </TableCell>
                  <TableCell>
                    {row.estimatedCompletionDate
                      ? new Date(
                          row.estimatedCompletionDate
                        ).toLocaleDateString()
                      : "No Estimated Completion Date"}
                  </TableCell>
                  <TableCell>{row.status || "No Status"}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditClick(row._id)}>
                      Edit
                    </Button>
                    <Button onClick={() => handleDeleteClick(row._id)}>
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
          {newProject._id ? "Edit Project" : "Create Project"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
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
            label="Start Date"
            value={newProject.startDate}
            onChange={(newValue) =>
              setNewProject((prev) => ({ ...prev, startDate: newValue }))
            }
          />
          {/* Always exclude End Date */}
          {/* <CustomDatePicker
    label="End Date"
    value={newProject.endDate}
    onChange={(newValue) =>
      setNewProject((prev) => ({ ...prev, endDate: newValue }))
    }
  /> */}
          <CustomDatePicker
            label="Estimated Completion Date"
            value={newProject.estimatedCompletionDate}
            onChange={(newValue) =>
              setNewProject((prev) => ({
                ...prev,
                estimatedCompletionDate: newValue,
              }))
            }
          />
          <TextField
            margin="dense"
            name="bonus"
            label="Bonus"
            type="number"
            fullWidth
            value={newProject.bonus}
            onChange={handleInputChange}
          />
          <Suspense fallback={<div>Loading...</div>}>
            <MultiautoSelection
              options={filteredEmployees}
              value={selectedEmployees}
              onChange={setSelectedEmployees}
            />
          </Suspense>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddOrUpdateProject}>
            {newProject._id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
