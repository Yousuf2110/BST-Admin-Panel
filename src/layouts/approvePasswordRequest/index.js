import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";

function ApprovePasswordRequest() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("authToken");

  const columns = [
    { Header: "Id", accessor: "id", align: "center" },
    { Header: "Account Number", accessor: "account_number", align: "center" },
    { Header: "Transaction ID", accessor: "transaction_id", align: "center" },
    { Header: "Amount", accessor: "amount", align: "center" },
    { Header: "Payment Screenshot", accessor: "payment_screenshot", align: "center" },
    { Header: "User Email", accessor: "user_email", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Created At", accessor: "created_at", align: "center" },
    {
      Header: "Actions",
      Cell: ({ row }) => {
        return row.original.status?.props?.children === "pending" ? (
          <Button
            color="primary"
            onClick={() => handleApproveClick(row.original?.id)}
            sx={{
              backgroundColor: "#007bff",
              "&:hover": {
                backgroundColor: "#0056b3",
              },
              color: "#fff",
            }}
          >
            Approve
          </Button>
        ) : null;
      },
      align: "center",
    },
  ];

  const fetchPins = () => {
    setLoading(true);
    setError("");
    axios
      .get("https://ecosphere-pakistan-backend.co-m.pk/api/reset-password", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const fetchedData = response?.data?.resetPasswordRequests;

        const filteredData = fetchedData.filter(
          (item) => item?.status?.toUpperCase() !== "APPROVE"
        );

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
                    : item?.status === "approve"
                    ? "green"
                    : "red",
                fontWeight: "bold",
              }}
            >
              {(item?.status || "N/A").toUpperCase()}
            </span>
          ),
          created_at: item?.created_at ? new Date(item.created_at).toLocaleString() : "N/A",
        }));

        setRows(formattedRows);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchPins();
  }, []);

  const handleApproveClick = (id) => {
    setLoading(true);
    axios
      .put(
        `https://ecosphere-pakistan-backend.co-m.pk/api/reset-password/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response?.data) {
          toast.success("New Password Generated successfully!");
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === id
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
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error:", error);
        toast.error("Failed to generate new password!");
      });
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
                  Generate New Password Request
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <CircularProgress sx={{ display: "block", margin: "auto" }} />
                ) : rows.length === 0 ? (
                  <MDTypography variant="h6" color="textSecondary" align="center">
                    No Password Request To Approve
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

      <ToastContainer />
    </DashboardLayout>
  );
}

ApprovePasswordRequest.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.string,
      status: PropTypes.string,
      user_email: PropTypes.string,
    }),
  }),
};

export default ApprovePasswordRequest;
