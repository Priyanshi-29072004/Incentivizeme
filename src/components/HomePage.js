import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, Paper } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const HomePage = () => {
  const [data, setData] = useState({
    totalOpenProjects: 0,
    totalClosedProjects: 0,
    topEarners: [],
  });

  useEffect(() => {
    // Fetch data from your API
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dashboard");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const topEarner = data.topEarners[0] || {};
  const bonus =
    typeof topEarner.bonus === "number" ? topEarner.bonus.toFixed(2) : "0.00";
  const name = topEarner.name || "No data";

  const chartData = {
    labels: data.topEarners.map((earner) => earner.name),
    datasets: [
      {
        label: "Bonus",
        data: data.topEarners.map((earner) => earner.bonus || 0),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ padding: 20 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Open Projects
              </Typography>
              <Typography variant="h4" color="primary">
                {data.totalOpenProjects}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Closed Projects
              </Typography>
              <Typography variant="h4" color="secondary">
                {data.totalClosedProjects}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6" gutterBottom>
              Top 10 Earners
            </Typography>
            <Bar data={chartData} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
