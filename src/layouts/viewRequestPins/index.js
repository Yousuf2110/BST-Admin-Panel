import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

function ViewRequestPins() {
  const [rows, setRows] = useState([]);
  const token = localStorage.getItem("authToken");

  console.log("token", token);

  const columns = [
    { Header: "Id", accessor: "id", align: "center" },
    { Header: "User Email", accessor: "user_email", align: "center" },
    { Header: "Pin", accessor: "pin", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Requested", accessor: "created_at", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const handleApprove = (pinId) => {
    axios
      .post(
        `https://ecosphere-pakistan-backend.co-m.pk/api/approve-withdraw/${pinId}`,
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert("Pin approved successfully!");
        setRows((prevRows) =>
          prevRows.map((row) => (row.id === pinId ? { ...row, status: "approved" } : row))
        );
      })
      .catch((error) => {
        console.error("Error approving pin:", error);
      });
  };

  useEffect(() => {
    axios
      .get("https://ecosphere-pakistan-backend.co-m.pk/api/all-users-pins", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetchedData = response.data.pins;

        const filteredData = fetchedData.filter((item) => item.status !== "used");

        const formattedRows = filteredData.map((item) => ({
          id: item.id,
          user_email: item.user_email,
          pin: item.pin,
          status: (
            <span
              style={{
                color: item.status === "unused" ? "red" : "green",
                fontWeight: "bold",
              }}
            >
              {item.status}
            </span>
          ),
          created_at: new Date(item.created_at).toLocaleString(),
          action: (
            <button
              onClick={() => handleApprove(item.id)}
              style={{
                padding: "5px 10px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Approve
            </button>
          ),
        }));

        setRows(formattedRows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [token]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Pins List
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ViewRequestPins;
