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
import { toast, ToastContainer } from "react-toastify";

function WithDrawList() {
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(true);
  const [tableDataGt2, setTableDataGt2] = useState({
    columns: [
      { Header: "ID", accessor: "id", align: "left" },
      { Header: "Email", accessor: "user_email", align: "center" },
      { Header: "Mobile", accessor: "mobile", align: "center" },
      { Header: "Amount", accessor: "amount", align: "center" },
      { Header: "Account Title", accessor: "account_title", align: "center" },
      { Header: "Bank", accessor: "bank", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],
    rows: [],
  });
  const [tableDataLte2, setTableDataLte2] = useState({ ...tableDataGt2 });

  const formatDate = (dateString) => {
    try {
      const cleanDate = dateString.split(".")[0].replace("T", " ");
      return cleanDate || "N/A";
    } catch {
      return "N/A";
    }
  };

  const handleApprove = async (id) => {
    console.log("id", id);
    try {
      const response = await axios.put(
        `https://backend.salespronetworks.com/api/approve-withdraw`,
        { ids: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Withdrawal approved successfully!");
        fetchData(); // Refresh data to reflect changes
      } else {
        toast.error("Failed to approve withdrawal. Please try again.");
      }
    } catch (error) {
      console.log("error", error);
      toast.error("An error occurred while approving withdrawal.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://backend.salespronetworks.com/api/withdraws", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const withdrawalsGt2 = response.data?.withdrawals_gt_2 || [];
      const withdrawalsLte2 = response.data?.withdrawals_lte_2 || [];

      console.log("withdrawalsGt2", withdrawalsLte2);

      // Sort withdrawals by amount in descending order (highest first)
      const sortedWithdrawalsGt2 = withdrawalsGt2
        .filter((item) => item.status !== "approved")
        .sort((a, b) => parseFloat(b.total_amount) - parseFloat(a.total_amount));

      const sortedWithdrawalsLte2 = withdrawalsLte2
        .filter((item) => item.status !== "approved")
        .sort((a, b) => parseFloat(b.total_amount) - parseFloat(a.total_amount));

      setTableDataGt2((prev) => ({
        ...prev,
        rows: sortedWithdrawalsGt2.map((item, i) => ({
          id: i + 1 || "N/A",
          user_email: item.user?.email || "N/A",
          mobile: item.user?.mobile || "N/A",
          account_title: item.user?.account_title || "N/A",
          bank: item.user?.bank || "N/A",
          amount: parseFloat(item.total_amount).toString().replace(/\.00$/, "") || "0",
          status: (
            <MDTypography variant="caption" color="info" fontWeight="medium">
              {item.status?.toUpperCase()}
            </MDTypography>
          ),
          created_at: formatDate(item?.user?.updatedAt),
          actions: item.status === "pending" && (
            <button
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleApprove(item?.ids)}
            >
              Approve
            </button>
          ),
        })),
      }));

      setTableDataLte2((prev) => ({
        ...prev,
        rows: sortedWithdrawalsLte2.map((item, i) => ({
          id: i + 1 || "N/A",
          user_email: item.user?.email || "N/A",
          mobile: item.user?.mobile || "N/A",
          account_title: item.user?.account_title || "N/A",
          bank: item.user?.bank || "N/A",
          amount: parseFloat(item.total_amount).toString().replace(/\.00$/, "") || "0",
          status: (
            <MDTypography variant="caption" color="info" fontWeight="medium">
              {item.status?.toUpperCase()}
            </MDTypography>
          ),
          created_at: formatDate(item.created_at),
          actions: item.status === "pending" && (
            <button
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleApprove(item?.ids)}
            >
              Approve
            </button>
          ),
        })),
      }));
    } catch (error) {
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
                  Withdrawals Greater Than 2
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <Grid container justifyContent="center">
                    <CircularProgress />
                  </Grid>
                ) : tableDataGt2.rows.length === 0 ? (
                  <MDBox textAlign="center" p={2}>
                    <MDTypography variant="h6" color="textSecondary">
                      No withdrawals greater than 2
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={tableDataGt2}
                    isSorted
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>

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
                  Withdrawals Less Than or Equal to 2
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <Grid container justifyContent="center">
                    <CircularProgress />
                  </Grid>
                ) : tableDataLte2.rows.length === 0 ? (
                  <MDBox textAlign="center" p={2}>
                    <MDTypography variant="h6" color="textSecondary">
                      No withdrawals less than or equal to 2
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={tableDataLte2}
                    isSorted
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <ToastContainer />
      </MDBox>
    </DashboardLayout>
  );
}

export default WithDrawList;
