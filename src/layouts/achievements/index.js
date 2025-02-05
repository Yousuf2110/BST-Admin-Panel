import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import CircularProgress from "@mui/material/CircularProgress";

function Achievements() {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [pinCount, setPinCount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("authToken");

  const columns = [
    { Header: "Id", accessor: "id", align: "center" },
    { Header: "User Name", accessor: "account_number", align: "center" },
    { Header: "Amount", accessor: "amount", align: "center" },
    { Header: "Star", accessor: "star", align: "center" },
    { Header: "Created At", accessor: "created_at", align: "center" },
    {
      Header: "Actions",
      accessor: "actions",
      align: "center",
      Cell: ({ row }) => {
        const state = row.original.status?.props?.children;
        return state === "PENDING" ? (
          <MDButton
            color="success"
            onClick={() => handleApproveClick(row.original)}
            size="small"
            style={{ fontSize: "12px", padding: "6px 12px", marginRight: "8px" }}
          >
            Send
          </MDButton>
        ) : null;
      },
    },
  ];

  const fetchPins = () => {
    setLoading(true);
    axios
      .get("https://backend.salespronetworks.com/api/pins", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetchedData = response.data.pins;
        console.log("fetchedData", fetchedData);
        const filteredData = fetchedData.filter((item) => item.status !== "approve");
        const formattedRows = filteredData.map((item) => ({
          id: item?.id || "",
          account_number: item?.account_number || "",
          amount: item?.amount || "",
          star: item?.star || "",
          payment_screenshot: (
            <a href={item?.payment_screenshot} target="_blank" rel="noopener noreferrer">
              View Screenshot
            </a>
          ),
          user_email: item?.user_email || "",
          status: (
            <span
              style={{
                color:
                  item?.status === "pending"
                    ? "orange"
                    : item?.status === "approved"
                    ? "green"
                    : "red",
                fontWeight: "bold",
              }}
            >
              {item?.status?.toUpperCase()}
            </span>
          ),
          created_at: item?.created_at ? new Date(item.created_at).toLocaleString() : "N/A",
        }));
        setRows(formattedRows);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch pins!");
        setLoading(false);
      });
  };

  const handleApproveClick = (pin) => {
    setSelectedPin(pin);
    setOpenDialog(true);
  };

  const handleDeleteAllConfirm = () => {
    setSubmitting(true);
    axios
      .delete("https://backend.salespronetworks.com/api/del-all-pins-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("All Requests deleted successfully!");
        setOpenDeleteAllDialog(false);
        fetchPins();
      })
      .catch((error) => {
        console.error("Error deleting all pins:", error);
        toast.error("Failed to delete all pins!");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setPinCount("");
    setSelectedPin(null);
  };

  const handleApproveSubmit = () => {
    setSubmitting(true);
    const payload = {
      email: selectedPin?.user_email,
      pin_count: pinCount,
      request_id: selectedPin?.id,
    };

    axios
      .post("https://backend.salespronetworks.com/api/approve-pin", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response?.data) {
          toast.success("Pin approved successfully!");
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === selectedPin?.id
                ? {
                    ...row,
                    status: <span style={{ color: "green", fontWeight: "bold" }}>approved</span>,
                  }
                : row
            )
          );
        } else {
          toast.error("Unexpected response from server!");
        }
        setSubmitting(false);
        handleDialogClose();
      })
      .catch((error) => {
        console.error("Error approving pin:", error);
        toast.error("Failed to approve pin!");
        setSubmitting(false);
      });
  };

  useEffect(() => {
    fetchPins();
  }, []);

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
                  Achievements
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <Grid container justifyContent="center" alignItems="center">
                    <CircularProgress />
                  </Grid>
                ) : rows.length === 0 ? (
                  <MDBox display="flex" justifyContent="center" alignItems="center" mt={5}>
                    <MDTypography variant="h6">No data available</MDTypography>
                  </MDBox>
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

      <ToastContainer />

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Approve Pin Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Pin Count"
            type="number"
            fullWidth
            value={pinCount}
            onChange={(e) => setPinCount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleApproveSubmit} color="primary" disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default Achievements;
