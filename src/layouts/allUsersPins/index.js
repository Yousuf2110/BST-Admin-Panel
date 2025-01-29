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
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";

function AllUsersPins() {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openDeleteAllDialog, setOpenDeleteAllDialog] = useState(false); // State for delete all modal
  const [selectedPin, setSelectedPin] = useState(null);
  const [pinCount, setPinCount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("authToken");

  const columns = [
    { Header: "Id", accessor: "id", align: "center" },
    { Header: "Account Number", accessor: "account_number", align: "center" },
    { Header: "Transaction ID", accessor: "transaction_id", align: "center" },
    { Header: "Amount", accessor: "amount", align: "center" },
    { Header: "Payment Screenshot", accessor: "payment_screenshot", align: "center" },
    { Header: "User Email", accessor: "user_email", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Role", accessor: "role", align: "center" },
    { Header: "Created At", accessor: "created_at", align: "center" },
    {
      Header: "Actions",
      accessor: "actions",
      align: "center",
      Cell: ({ row }) => {
        const state = row.original.status?.props?.children;
        return state === "PENDING" ? (
          <>
            <MDButton
              color="success"
              onClick={() => handleApproveClick(row.original)}
              size="small"
              style={{ fontSize: "12px", padding: "6px 12px", marginRight: "8px" }}
            >
              Approve
            </MDButton>
            <MDButton
              color="error"
              onClick={() => handleRejectClick(row.original)}
              size="small"
              style={{ fontSize: "12px", padding: "6px 12px" }}
            >
              Reject
            </MDButton>
          </>
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
          transaction_id: item?.transaction_id || "",
          amount: item?.amount || "",
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

  const handleRejectClick = (pin) => {
    setSelectedPin(pin);
    setOpenRejectDialog(true);
  };

  const handleDeleteAllClick = () => {
    setOpenDeleteAllDialog(true); // Open the delete all confirmation modal
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
        fetchPins(); // Refresh the data
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

  const handleRejectDialogClose = () => {
    setOpenRejectDialog(false);
    setSelectedPin(null);
  };

  const handleDeleteAllDialogClose = () => {
    setOpenDeleteAllDialog(false); // Close the delete all modal
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

  const handleRejectSubmit = () => {
    setSubmitting(true);
    axios
      .put(
        `https://backend.salespronetworks.com/api/reject-pin/${selectedPin?.id}`,
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("New Pin Request Rejected successfully!");
        setSubmitting(false);
        handleRejectDialogClose();
        fetchPins();
      })
      .catch((error) => {
        console.error("Error rejecting pin:", error);
        toast.error("New Pin Request Rejected failed!");
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
                  Pins List
                </MDTypography>
                <MDButton
                  color="error"
                  onClick={handleDeleteAllClick}
                  style={{
                    marginLeft: "auto",
                    background: "red",
                    color: "#fff",
                    marginTop: 10,
                  }}
                >
                  Delete All Requests
                </MDButton>
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

      <Dialog open={openRejectDialog} onClose={handleRejectDialogClose}>
        <DialogTitle>Reject Pin Request</DialogTitle>
        <DialogContent>Do you want to reject this pin request?</DialogContent>
        <DialogActions>
          <Button onClick={handleRejectDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRejectSubmit} color="error" disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteAllDialog} onClose={handleDeleteAllDialogClose}>
        <DialogTitle>Delete All Requests</DialogTitle>
        <DialogContent>
          Are you sure you want to delete all Requests? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAllDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAllConfirm} color="error" disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

AllUsersPins.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.string,
      status: PropTypes.string,
      user_email: PropTypes.string,
    }),
  }),
};

export default AllUsersPins;
