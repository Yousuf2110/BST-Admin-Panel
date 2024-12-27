import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

import { useState, useEffect } from "react";
import axios from "axios";

function AllUsers() {
  const token = localStorage.getItem("authToken");
  const [tableData, setTableData] = useState({
    columns: [
      { Header: "User ID", accessor: "id", align: "left" },
      { Header: "Name", accessor: "name", align: "center" },
      { Header: "Email", accessor: "email", align: "center" },
      { Header: "Mobile", accessor: "mobile", align: "center" },
      { Header: "Role", accessor: "role", align: "center" },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://ecosphere-pakistan-backend.co-m.pk/api/users", {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        const pins = data.pins || [];

        const rows = pins.map((pin) => ({
          id: pin.id,
          name: pin.name,
          email: pin.email,
          mobile: pin.mobile,
          role: pin.role,
        }));

        setTableData((prevState) => ({
          ...prevState,
          rows,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

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
                  All Users
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

export default AllUsers;
