import React, { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Notifications() {
  const [data, setData] = useState({ pending_withdraw_requests: 0, pending_pin_requests: 0 });
  const [error, setError] = useState(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://ecosphere-pakistan-backend.co-m.pk/api/sidebar-pending",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (err) {
        console.error("Error fetching API data:", err);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, [token]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Pending Requests</MDTypography>
              </MDBox>
              <MDBox pt={2} px={2}>
                {error ? (
                  <MDAlert color="error" dismissible>
                    {error}
                  </MDAlert>
                ) : (
                  <>
                    <MDAlert
                      color="info"
                      dismissible
                      style={{ backgroundColor: "#17a2b8", color: "white" }}
                    >
                      <MDTypography variant="body2" color="white">
                        Pending Withdraw Requests: {data.pending_withdraw_requests}
                      </MDTypography>
                    </MDAlert>

                    <MDAlert
                      color="info"
                      dismissible
                      style={{ backgroundColor: "#17a2b8", color: "white" }}
                    >
                      <MDTypography variant="body2" color="white">
                        Pending Generate Password Requests: {data.pending_reset_password_requests}
                      </MDTypography>
                    </MDAlert>
                    <MDAlert
                      color="info"
                      dismissible
                      style={{ backgroundColor: "#17a2b8", color: "white" }}
                    >
                      <MDTypography variant="body2" color="white">
                        Pending PIN Requests: {data.pending_pin_requests}
                      </MDTypography>
                    </MDAlert>
                  </>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Notifications;
