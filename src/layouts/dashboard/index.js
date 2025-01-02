import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CircularProgress from "@mui/material/CircularProgress";

function Dashboard() {
  const [data, setData] = useState({
    current_income: "0.00",
    reward_income: 0,
    total_income: 0,
    available_pins: 0,
    income_2stars: "---",
    income_gt_2stars: "---",
    total_pins: "---",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://ecosphere-pakistan-backend.co-m.pk/api/admin-dashboard",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="Total Income"
                  count={`${data.incomeLt2stars}`}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="primary"
                  icon={<MonetizationOnIcon />}
                  title="Total Income (2+)"
                  count={`${data.income_gt_2stars}`}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="confirmation_number"
                  title="Total Pins"
                  count={data.total_pins}
                />
              </MDBox>
            </Grid>
          </Grid>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
