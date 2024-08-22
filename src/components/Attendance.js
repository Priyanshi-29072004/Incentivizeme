import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import DateTimePickerComponent from "./Datetimepicker";

export const Attendance = () => {
  const [rows, setRows] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  const [open, setOpen] = useState(false);
  const [newAttendance, setNewAttendance] = useState({
    _id: null,
    employee: { _id: "", name: "" },
    project: { _id: "", name: "" },
    startTime: null,
    endTime: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceRes, employeesRes, projectsRes] = await Promise.all([
          fetch("http://localhost:5000/api/attendances"),
          fetch("http://localhost:5000/api/employees"),
          fetch("http://localhost:5000/api/projects"),
        ]);

        const [attendanceData, employeeData, projectData] = await Promise.all([
          attendanceRes.json(),
          employeesRes.json(),
          projectsRes.json(),
        ]);

        const simplifiedAttendanceData = attendanceData.map((record) => ({
          ...record,
          totalHours: record.totalHours ?? 0, // Default to 0 if undefined
        }));

        const simplifiedEmployeeData = employeeData.map((employee) => ({
          _id: employee._id,
          name: `${employee.firstName} ${employee.lastName}`,
        }));

        const simplifiedProjectData = projectData.map((project) => ({
          _id: project._id,
          name: project.name,
        }));

        setRows(simplifiedAttendanceData);
        setEmployees(simplifiedEmployeeData);
        setProjects(simplifiedProjectData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewAttendance({
      _id: null,
      employee: { _id: "", name: "" },
      project: { _id: "", name: "" },
      startTime: null,
      endTime: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendance({
      ...newAttendance,
      [name]: { _id: value },
    });
  };

  const handleDateChange = (name) => (date) => {
    setNewAttendance({
      ...newAttendance,
      [name]: date,
    });
  };

  const handleAddAttendance = async () => {
    const attendanceData = {
      _id: newAttendance._id,
      employee: newAttendance.employee._id,
      project: newAttendance.project._id,
      startTime: newAttendance.startTime,
      endTime: newAttendance.endTime,
    };

    if (newAttendance._id) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/attendances/${newAttendance._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(attendanceData),
          }
        );

        if (response.ok) {
          const updatedAttendance = await response.json();
          setRows(
            rows.map((row) =>
              row._id === updatedAttendance._id ? updatedAttendance : row
            )
          );
        } else {
          console.error("Failed to update attendance");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        const response = await fetch("http://localhost:5000/api/attendances", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attendanceData),
        });

        if (response.ok) {
          const savedAttendance = await response.json();
          setRows([...rows, savedAttendance]);
        } else {
          console.error("Failed to add attendance");
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
        `http://localhost:5000/api/attendances/${_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setRows(rows.filter((row) => row._id !== _id));
      } else {
        console.error("Failed to delete attendance");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditClick = (_id) => {
    const attendanceToEdit = rows.find((row) => row._id === _id);
    setNewAttendance({
      _id: attendanceToEdit._id,
      employee: attendanceToEdit.employee,
      project: attendanceToEdit.project,
      startTime: new Date(attendanceToEdit.startTime),
      endTime: new Date(attendanceToEdit.endTime),
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
              <TableCell>Employee</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Total Hours</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                <TableCell>{row.employee.name}</TableCell>
                <TableCell>{row.project.name}</TableCell>
                <TableCell>
                  {new Date(row.startTime).toLocaleString()}
                </TableCell>
                <TableCell>{new Date(row.endTime).toLocaleString()}</TableCell>
                <TableCell>{(row.totalHours ?? 0).toFixed(2)}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditClick(row._id)}
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {newAttendance._id ? "Edit Attendance" : "Create Attendance"}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="employee-label">Employee</InputLabel>
            <Select
              labelId="employee-label"
              value={newAttendance.employee._id}
              name="employee"
              onChange={handleInputChange}
              fullWidth
            >
              {employees.map((employee) => (
                <MenuItem key={employee._id} value={employee._id}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="project-label">Project</InputLabel>
            <Select
              labelId="project-label"
              value={newAttendance.project._id}
              name="project"
              onChange={handleInputChange}
              fullWidth
            >
              {projects.map((project) => (
                <MenuItem key={project._id} value={project._id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <DateTimePickerComponent
            label="Start Time"
            value={newAttendance.startTime}
            disableFuture={true}
            onChange={handleDateChange("startTime")}
          />
          <DateTimePickerComponent
            label="End Time"
            value={newAttendance.endTime}
            onChange={handleDateChange("endTime")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddAttendance}>
            {newAttendance._id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Attendance;
