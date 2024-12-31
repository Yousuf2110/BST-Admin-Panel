import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import axios from "axios";

function WithDrawList() {
  const token = localStorage.getItem("authToken");
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "ID", accessor: "id", align: "left" },
      { Header: "Email", accessor: "user_email", align: "center" },
      { Header: "Amount", accessor: "amount", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Requested", accessor: "created_at", align: "center" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],
    rows: [],
  });
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  const formatDate = (dateString) => {
    try {
      const cleanDate = dateString.split(".")[0].replace("T", " ");
      return cleanDate || "N/A";
    } catch (error) {
      return "N/A";
    }
  };

  const handleApprove = (id) => {
    console.log("Approved withdrawal with ID:", id);
  };

  const handleReject = (id) => {
    console.log("Rejected withdrawal with ID:", id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://ecosphere-pakistan-backend.co-m.pk/api/withdraws",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const mappedRows = response.data?.withdraw.map((item) => ({
          id: item.id || "N/A",
          user_email: item.user_email || "N/A",
          amount: parseFloat(item.amount).toFixed(2) || "0.00",
          status: (
            <MDTypography
              variant="caption"
              color={item.status === "approved" ? "success" : "info"}
              fontWeight="medium"
            >
              {item.status?.toUpperCase() || "N/A"}
            </MDTypography>
          ),
          created_at: formatDate(item.created_at),
          updated_at: formatDate(item.updated_at),
          actions:
            item.status === "pending" ? (
              <div>
                <button onClick={() => handleApprove(item.id)}>Approve</button>
                <button onClick={() => handleReject(item.id)}>Reject</button>
              </div>
            ) : null,
        }));

        if (mappedRows.length === 0) {
          setEmpty(true); // Set empty state if no withdrawals
        } else {
          setTableData((prevState) => ({
            ...prevState,
            rows: mappedRows,
          }));
        }
        setLoading(false); // Data is loaded
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchData();
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
                  Withdraws List
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <Grid container justifyContent="center">
                    <CircularProgress /> {/* Loader while data is loading */}
                  </Grid>
                ) : empty ? (
                  <MDBox textAlign="center" p={2}>
                    <MDTypography variant="h6" color="textSecondary">
                      No withdrawals found.
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={tableData}
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
    </DashboardLayout>
  );
}

export default WithDrawList;
