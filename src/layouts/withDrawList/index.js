import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import { useState, useEffect } from "react";
import axios from "axios";

function WithDrawList() {
  const token = localStorage.getItem("authToken");
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "ID", accessor: "id", align: "left" },
      { Header: "Email", accessor: "user_email", align: "center" },
      { Header: "Amount ($)", accessor: "amount", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Created At", accessor: "created_at", align: "center" },
      { Header: "Updated At", accessor: "updated_at", align: "center" },
    ],
    rows: [],
  });

  const formatDate = (dateString) => {
    try {
      // Remove timezone offset and milliseconds if present
      const cleanDate = dateString.split(".")[0].replace("T", " ");
      return cleanDate || "N/A";
    } catch (error) {
      return "N/A";
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

        console.log("xx-response", response);

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
        }));

        console.log("xx-mappedRows", mappedRows);

        setTableData((prevState) => ({
          ...prevState,
          rows: mappedRows,
        }));
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
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
                <DataTable
                  table={tableData}
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

export default WithDrawList;
