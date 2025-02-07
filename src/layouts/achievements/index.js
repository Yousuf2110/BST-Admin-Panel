import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Achievements() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const token = localStorage.getItem("authToken");

  const columns = [
    { Header: "Id", accessor: "id", align: "center" },
    { Header: "User Email", accessor: "user_email", align: "center" },
    { Header: "Bonus", accessor: "bonus", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    {
      Header: "Actions",
      accessor: "actions",
      align: "center",
      Cell: ({ row }) => {
        const state = row.original.status?.props?.children;
        return state === "PENDING" ? (
          <MDButton
            color="success"
            onClick={() => handleOpenModal(row.original)}
            size="small"
            style={{ fontSize: "12px", padding: "6px 12px", marginRight: "8px" }}
          >
            Send
          </MDButton>
        ) : null;
      },
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://backend.salespronetworks.com/api/reward-list", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedData = response.data.rewards;
      console.log("Fetched Data:", fetchedData);

      const formattedRows = fetchedData
        .filter((item) => item?.status === "pending")
        .map((item) => ({
          id: item.id || "",
          user_email: item.user_email || "",
          bonus: item.bonus || "",
          status: (
            <span
              style={{
                color: "orange",
                fontWeight: "bold",
              }}
            >
              {item?.status?.toUpperCase()}
            </span>
          ),
        }));

      setRows(formattedRows);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (reward) => {
    setSelectedReward(reward);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedReward(null);
  };

  const handleConfirmApprove = async () => {
    if (!selectedReward) return;
    setOpen(false);
    try {
      const response = await axios.put(
        `https://backend.salespronetworks.com/api/reward-list/${selectedReward.id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Reward approved successfully!");
        fetchData();
      } else {
        toast.error("Failed to approve reward.");
      }
    } catch (error) {
      console.error("Error approving reward:", error);
      toast.error("Error occurred while approving reward.");
    }
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

      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Confirm Approval</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this reward for{" "}
            <strong>{selectedReward?.user_email}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseModal} color="error">
            Cancel
          </MDButton>
          <MDButton onClick={handleConfirmApprove} color="success">
            Confirm
          </MDButton>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </DashboardLayout>
  );
}

export default Achievements;
