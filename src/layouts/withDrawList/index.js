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
  const [tableDataGt2, setTableDataGt2] = useState({
    columns: [
      { Header: "ID", accessor: "id", align: "left" },
      { Header: "Email", accessor: "user_email", align: "center" },
      { Header: "Mobile", accessor: "mobile", align: "center" },
      { Header: "Amount", accessor: "amount", align: "center" },
      { Header: "Account Title", accessor: "account_title", align: "center" },
      { Header: "Bank", accessor: "bank", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Requested", accessor: "created_at", align: "center" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],
    rows: [],
  });

  const [tableDataLte2, setTableDataLte2] = useState({
    columns: [
      { Header: "ID", accessor: "id", align: "left" },
      { Header: "Email", accessor: "user_email", align: "center" },
      { Header: "Mobile", accessor: "mobile", align: "center" },
      { Header: "Amount", accessor: "amount", align: "center" },
      { Header: "Account Title", accessor: "account_title", align: "center" },
      { Header: "Bank", accessor: "bank", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Requested", accessor: "created_at", align: "center" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],
    rows: [],
  });

  const [loading, setLoading] = useState(true);
  const [emptyGt2, setEmptyGt2] = useState(false);
  const [emptyLte2, setEmptyLte2] = useState(false);

  const formatDate = (dateString) => {
    try {
      const cleanDate = dateString.split(".")[0].replace("T", " ");
      return cleanDate || "N/A";
    } catch (error) {
      return "N/A";
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.put(
        `https://ecosphere-pakistan-backend.co-m.pk/api/approve-withdraw/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setTableDataGt2((prevState) => {
          const updatedRows = prevState.rows.map((row) =>
            row.id === id
              ? {
                  ...row,
                  status: (
                    <MDTypography variant="caption" color="success" fontWeight="medium">
                      APPROVED
                    </MDTypography>
                  ),
                }
              : row
          );
          return {
            ...prevState,
            rows: updatedRows,
          };
        });

        toast.success("Withdrawal approved successfully!");
      }
    } catch (error) {
      toast.error("Failed to approve withdrawal.");
    }
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

        const withdrawalsGt2 = response.data?.withdrawals_gt_2 || [];
        const withdrawalsLte2 = response.data?.withdrawals_lte_2 || [];

        if (
          withdrawalsGt2.length === 0 ||
          withdrawalsGt2.every((item) => item.status === "APPROVED")
        ) {
          setEmptyGt2(true);
        } else {
          const rowsGt2 = withdrawalsGt2
            .filter((item) => item.status !== "APPROVED")
            .map((item) => ({
              id: item.id || "N/A",
              user_email: item.user.email || "N/A",
              mobile: item.user.mobile || "N/A",
              account_title: item.user.account_title || "N/A",
              bank: item.user.bank || "N/A",
              amount: parseFloat(item.amount).toFixed(2) || "0.00",
              status: (
                <MDTypography variant="caption" color="info" fontWeight="medium">
                  {item.status?.toUpperCase() || "N/A"}
                </MDTypography>
              ),
              created_at: formatDate(item.created_at),
              actions:
                item.status === "pending" ? (
                  <div
                    style={{ display: "flex", justifyContent: "space-around", marginTop: "10px" }}
                  >
                    <button
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: "pointer",
                        borderRadius: "5px",
                        transition: "background-color 0.3s ease",
                        marginRight: "10px",
                      }}
                      onClick={() => handleApprove(item.id)}
                    >
                      Approve
                    </button>
                  </div>
                ) : null,
            }));
          setTableDataGt2((prevState) => ({
            ...prevState,
            rows: rowsGt2,
          }));
        }

        if (
          withdrawalsLte2.length === 0 ||
          withdrawalsLte2.every((item) => item.status === "approved")
        ) {
          setEmptyLte2(true);
        } else {
          const rowsLte2 = withdrawalsLte2
            .filter((item) => item.status !== "approved") // Exclude approved rows
            .map((item) => ({
              id: item.id || "N/A",
              user_email: item.user.email || "N/A",
              mobile: item.user.mobile || "N/A",
              account_title: item.user.account_title || "N/A",
              bank: item.user.bank || "N/A",
              amount: parseFloat(item.amount).toFixed(2) || "0.00",
              status: (
                <MDTypography variant="caption" color="info" fontWeight="medium">
                  {item.status?.toUpperCase() || "N/A"}
                </MDTypography>
              ),
              created_at: formatDate(item.created_at),
              actions:
                item.status === "pending" ? (
                  <div
                    style={{ display: "flex", justifyContent: "space-around", marginTop: "10px" }}
                  >
                    <button
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: "pointer",
                        borderRadius: "5px",
                        transition: "background-color 0.3s ease",
                        marginRight: "10px",
                      }}
                      onClick={() => handleApprove(item.id)}
                    >
                      Approve
                    </button>
                  </div>
                ) : null,
            }));
          setTableDataLte2((prevState) => ({
            ...prevState,
            rows: rowsLte2,
          }));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
        setLoading(false);
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
                  Withdrawals Greater Than 2
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <Grid container justifyContent="center">
                    <CircularProgress />
                  </Grid>
                ) : emptyGt2 ? (
                  <MDBox textAlign="center" p={2}>
                    <MDTypography variant="h6" color="textSecondary">
                      No withdrawals greater than 2.
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={tableDataGt2}
                    isSorted={true}
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
                  Withdrawals Less Than or Equal to 2 Stars
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <Grid container justifyContent="center">
                    <CircularProgress />
                  </Grid>
                ) : emptyLte2 ? (
                  <MDBox textAlign="center" p={2}>
                    <MDTypography variant="h6" color="textSecondary">
                      No withdrawals less than or equal to 2 Stars
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={tableDataLte2}
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

export default WithDrawList;
