import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

function ProductRequest() {
  const token = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "ID", accessor: "product_id", align: "left" },
      { Header: "Email", accessor: "user_email", align: "center" },
      { Header: "Mobile", accessor: "phone", align: "center" },
      { Header: "Amount", accessor: "amount", align: "center" },
      { Header: "View ScreenShot", accessor: "payment_screenshot", align: "center" },
      { Header: "Product Name", accessor: "product_name", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],
    rows: [],
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleMenuOpen = (event, id, status) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
    setSelectedStatus(status);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
    setSelectedStatus("");
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);

    try {
      const response = await axios.put(
        `https://ecosphere-pakistan-backend.co-m.pk/api/product-requests/${selectedId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Status updated successfully!");
        fetchData(); // Refresh the table data
      } else {
        toast.error("Failed to update status. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      handleMenuClose();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://ecosphere-pakistan-backend.co-m.pk/api/product-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formattedData = response.data?.requests?.map((item) => ({
        product_id: item.product_id || "N/A",
        user_email: item?.user_email || "N/A",
        phone: item?.phone || "N/A",
        payment_screenshot: item.payment_screenshot ? (
          <a href={item.payment_screenshot} target="_blank" rel="noopener noreferrer">
            <button
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              View ScreenShot
            </button>
          </a>
        ) : (
          "N/A"
        ),
        product_name: item.product_name || "N/A",
        status: (
          <MDTypography variant="caption" color="info" fontWeight="medium">
            {item.status?.toUpperCase()}
          </MDTypography>
        ),
        actions: (
          <>
            <IconButton
              aria-label="more"
              aria-controls="actions-menu"
              aria-haspopup="true"
              onClick={(event) => handleMenuOpen(event, item?.id, item?.status)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="actions-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && selectedId === item?.id}
              onClose={handleMenuClose}
            >
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value="Done">Done</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Menu>
          </>
        ),
      }));

      setTableData((prev) => ({
        ...prev,
        rows: formattedData,
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
                  Product Requests
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <Grid container justifyContent="center">
                    <CircularProgress />
                  </Grid>
                ) : tableData.rows.length === 0 ? (
                  <MDBox textAlign="center" p={2}>
                    <MDTypography variant="h6" color="textSecondary">
                      No product requests found
                    </MDTypography>
                  </MDBox>
                ) : (
                  <DataTable
                    table={tableData}
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

export default ProductRequest;
