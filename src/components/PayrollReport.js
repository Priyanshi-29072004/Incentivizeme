import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Container,
  Box,
} from "@mui/material";

const PayrollReport = () => {
  const [reportData, setReportData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReport = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/report", {
        params: { startDate, endDate },
      });
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const handleGenerateReport = () => {
    fetchReport();
  };

  return (
    <Container sx={{ mt: 4, p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Payroll Report
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4} container alignItems="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateReport}
              sx={{ mt: 2 }}
              fullWidth
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: (theme) => theme.palette.primary.light,
                color: (theme) => theme.palette.secondary.contrastText,
              }}
            >
              <TableCell>Employee</TableCell>
              <TableCell>Total Hours</TableCell>
              <TableCell>Bonus</TableCell>
              <TableCell>Gross Pay</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.employee.name}</TableCell>
                <TableCell>{row.totalHours}</TableCell>
                <TableCell>${row.bonus.toFixed(2)}</TableCell>
                <TableCell>${row.grossPay.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PayrollReport;
