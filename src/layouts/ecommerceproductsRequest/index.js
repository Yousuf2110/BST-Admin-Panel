// ECommerceProductRequest.js
import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";

function ECommerceProductRequest() {
  // State to manage active view
  const [activeView, setActiveView] = useState("requests"); // 'requests' or 'withdrawals'

  // ✅ Static Product Requests Data
  const staticRequests = [
    {
      product_id: "1001",
      user_email: "ali@gmail.com",
      phone: "+92 300 1234567",
      payment_screenshot: (
        <a href="#screenshot1" target="_blank" rel="noopener noreferrer">
          <button
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "6px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            View ScreenShot
          </button>
        </a>
      ),
      product_name: "Wireless Headphones",
      status: (
        <MDTypography variant="caption" color="info" fontWeight="medium">
          PENDING
        </MDTypography>
      ),
    },
    {
      product_id: "1002",
      user_email: "sana@yahoo.com",
      phone: "+92 311 2345678",
      payment_screenshot: (
        <a href="#screenshot2" target="_blank" rel="noopener noreferrer">
          <button
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "6px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            View ScreenShot
          </button>
        </a>
      ),
      product_name: "Smart Watch Pro",
      status: (
        <MDTypography variant="caption" color="warning" fontWeight="medium">
          PROCESSING
        </MDTypography>
      ),
    },
    {
      product_id: "1003",
      user_email: "usman@outlook.com",
      phone: "+92 322 3456789",
      payment_screenshot: "N/A",
      product_name: "Bluetooth Speaker",
      status: (
        <MDTypography variant="caption" color="error" fontWeight="medium">
          FAILED
        </MDTypography>
      ),
    },
    {
      product_id: "1004",
      user_email: "zara@gmail.com",
      phone: "+92 333 4567890",
      payment_screenshot: (
        <a href="#screenshot4" target="_blank" rel="noopener noreferrer">
          <button
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "6px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            View ScreenShot
          </button>
        </a>
      ),
      product_name: "Digital Camera",
      status: (
        <MDTypography variant="caption" color="success" fontWeight="medium">
          DONE
        </MDTypography>
      ),
    },
    {
      product_id: "1007",
      user_email: "tariq@gmail.com",
      phone: "+92 366 7890123",
      payment_screenshot: (
        <a href="#screenshot7" target="_blank" rel="noopener noreferrer">
          <button
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "6px 12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            View ScreenShot
          </button>
        </a>
      ),
      product_name: "Smartphone X",
      status: (
        <MDTypography variant="caption" color="success" fontWeight="medium">
          DELIVERED
        </MDTypography>
      ),
    },
  ];

  // ✅ Static Withdrawal Requests Data
  const staticWithdrawals = [
    {
      id: "WDR001",
      user_email: "ali@gmail.com",
      method: "Bank Transfer",
      amount: "$250.00",
      status: (
        <MDTypography variant="caption" color="warning" fontWeight="medium">
          PENDING
        </MDTypography>
      ),
      requested_at: "2024-04-01 10:30 AM",
    },
    {
      id: "WDR002",
      user_email: "sana@yahoo.com",
      method: "JazzCash",
      amount: "$180.50",
      status: (
        <MDTypography variant="caption" color="success" fontWeight="medium">
          COMPLETED
        </MDTypography>
      ),
      requested_at: "2024-04-02 03:15 PM",
    },
    {
      id: "WDR003",
      user_email: "usman@outlook.com",
      method: "EasyPaisa",
      amount: "$300.00",
      status: (
        <MDTypography variant="caption" color="error" fontWeight="medium">
          FAILED
        </MDTypography>
      ),
      requested_at: "2024-04-03 11:20 AM",
    },
    {
      id: "WDR004",
      user_email: "zara@gmail.com",
      method: "Bank Transfer",
      amount: "$500.00",
      status: (
        <MDTypography variant="caption" color="info" fontWeight="medium">
          VERIFIED
        </MDTypography>
      ),
      requested_at: "2024-04-04 09:00 AM",
    },
    {
      id: "WDR005",
      user_email: "fahad@gmail.com",
      method: "PayPal",
      amount: "$120.75",
      status: (
        <MDTypography variant="caption" color="success" fontWeight="medium">
          COMPLETED
        </MDTypography>
      ),
      requested_at: "2024-04-05 02:45 PM",
    },
  ];

  // ✅ Table Data for Product Requests
  const requestTableData = {
    columns: [
      { Header: "ID", accessor: "product_id", align: "left" },
      { Header: "Email", accessor: "user_email", align: "center" },
      { Header: "Mobile", accessor: "phone", align: "center" },
      { Header: "Screenshot", accessor: "payment_screenshot", align: "center" },
      { Header: "Product Name", accessor: "product_name", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
    ],
    rows: staticRequests,
  };

  // ✅ Table Data for Withdrawals
  const withdrawalTableData = {
    columns: [
      { Header: "Withdraw ID", accessor: "id", align: "left" },
      { Header: "User Email", accessor: "user_email", align: "center" },
      { Header: "Method", accessor: "method", align: "center" },
      { Header: "Amount", accessor: "amount", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Requested At", accessor: "requested_at", align: "center" },
    ],
    rows: staticWithdrawals,
  };

  // Current table data based on active view
  const currentTableData =
    activeView === "requests" ? requestTableData : withdrawalTableData;

  // Title based on active view
  const pageTitle =
    activeView === "requests" ? "Product Requests" : "Withdrawal Requests";

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              {/* Header with Tabs */}
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  {pageTitle}
                </MDTypography>

                {/* Toggle Buttons */}
                <MDBox display="flex" gap={1}>
                  <MDButton
                    variant={activeView === "requests" ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setActiveView("requests")}
                    startIcon={<Icon>shopping_cart</Icon>}
                    color="white"
                  >
                    Product Requests
                  </MDButton>
                  <MDButton
                    variant={activeView === "withdrawals" ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setActiveView("withdrawals")}
                    startIcon={<Icon>payments</Icon>}
                    color="white"
                  >
                    Withdraw List
                  </MDButton>
                </MDBox>
              </MDBox>

              {/* Table Body */}
              <MDBox pt={3} px={2} pb={3}>
                <DataTable
                  table={currentTableData}
                  isSorted
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

export default ECommerceProductRequest;