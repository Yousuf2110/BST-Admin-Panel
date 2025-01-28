import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function ViewRequestPins() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // State for controlling the modal
  const token = localStorage.getItem("authToken");

  const columns = [
    { Header: "Id", accessor: "id", align: "center" },
    { Header: "User Email", accessor: "user_email", align: "center" },
    { Header: "Pin", accessor: "pin", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Requested", accessor: "created_at", align: "center" },
  ];

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("https://backend.salespronetworks.com/api/all-users-pins", {
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
                color: item.status === "unused" ? "green" : "red",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {item.status}
            </span>
          ),
          created_at: new Date(item.created_at).toLocaleString(),
        }));
        setRows(formattedRows);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleDeleteAllPins = () => {
    setOpen(true); // Open the confirmation modal
  };

  const handleConfirmDelete = () => {
    axios
      .delete("https://backend.salespronetworks.com/api/delete-all-pins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setOpen(false); // Close the modal
        fetchData(); // Refresh the data
      })
      .catch((error) => {
        console.error("Error deleting pins:", error);
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false); // Close the modal without deleting
  };

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
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDeleteAllPins}
                  style={{
                    marginLeft: "auto",
                    background: "red",
                    color: "#fff",
                    marginTop: 10,
                  }}
                >
                  Delete All Pins
                </Button>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                    <CircularProgress />
                  </div>
                ) : rows.length === 0 ? (
                  <MDTypography variant="h6" color="textSecondary" align="center">
                    No data available
                  </MDTypography>
                ) : (
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={true}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Delete All Pins?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete all pins? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default ViewRequestPins;
