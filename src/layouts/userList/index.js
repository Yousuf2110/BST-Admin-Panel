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
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AllUsers() {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const [tableDataLte2, setTableDataLte2] = useState({
    columns: [
      { Header: "User ID", accessor: "id", align: "left" },
      { Header: "Name", accessor: "name", align: "center" },
      { Header: "Account Title", accessor: "account_title", align: "center" },
      { Header: "Email", accessor: "email", align: "center" },
      { Header: "Mobile", accessor: "mobile", align: "center" },
      { Header: "Bank", accessor: "bank", align: "center" },
      { Header: "Role", accessor: "role", align: "center" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],
    rows: [],
  });

  const [tableDataGt2, setTableDataGt2] = useState({
    columns: [
      { Header: "User ID", accessor: "id", align: "left" },
      { Header: "Name", accessor: "name", align: "center" },
      { Header: "Account Title", accessor: "account_title", align: "center" },
      { Header: "Email", accessor: "email", align: "center" },
      { Header: "Mobile", accessor: "mobile", align: "center" },
      { Header: "Bank", accessor: "bank", align: "center" },
      { Header: "Role", accessor: "role", align: "center" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],
    rows: [],
  });

  const [loading, setLoading] = useState(true);
  const [emptyLte2, setEmptyLte2] = useState(false);
  const [emptyGt2, setEmptyGt2] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    account_title: "",
    bank: "",
  });

  const [searchTermLte2, setSearchTermLte2] = useState("");
  const [searchTermGt2, setSearchTermGt2] = useState("");

  const [originalRowsLte2, setOriginalRowsLte2] = useState([]);
  const [originalRowsGt2, setOriginalRowsGt2] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://backend.salespronetworks.com/api/users", {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data || {};
        const usersLte2 = data.users_lte_2 || [];
        const usersGt2 = data.users_gt_2 || [];

        if (usersLte2.length === 0) {
          setEmptyLte2(true);
        } else {
          const rowsLte2 = usersLte2.map((user) => ({
            id: user.id,
            name: user.name,
            account_title: user.account_title,
            email: user.email,
            mobile: user.mobile,
            bank: user.bank,
            role: user.role,
            actions:
              user.role !== "admin" ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditClick(user)}
                  style={{ color: "white" }}
                >
                  Edit
                </Button>
              ) : null,
          }));

          setTableDataLte2((prevState) => ({
            ...prevState,
            rows: rowsLte2,
          }));
          setOriginalRowsLte2(rowsLte2);
        }

        if (usersGt2.length === 0) {
          setEmptyGt2(true);
        } else {
          const rowsGt2 = usersGt2.map((user) => ({
            id: user.id,
            name: user.name,
            account_title: user.account_title,
            email: user.email,
            mobile: user.mobile,
            bank: user.bank,
            role: user.role,
            actions:
              user.role !== "admin" ? (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ color: "white" }}
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </Button>
              ) : null,
          }));
          setTableDataGt2((prevState) => ({
            ...prevState,
            rows: rowsGt2,
          }));
          setOriginalRowsGt2(rowsGt2);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Handle search for users with <= 2 stars
  const handleSearchLte2 = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTermLte2(term);
    const filtered = originalRowsLte2.filter(
      (row) =>
        row.name.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term) ||
        row.mobile.toLowerCase().includes(term)
    );
    setTableDataLte2((prevState) => ({
      ...prevState,
      rows: filtered,
    }));
    setEmptyLte2(filtered.length === 0);
  };

  // Handle search for users with > 2 stars
  const handleSearchGt2 = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTermGt2(term);
    const filtered = originalRowsGt2.filter(
      (row) =>
        row.name.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term) ||
        row.mobile.toLowerCase().includes(term)
    );
    setTableDataGt2((prevState) => ({
      ...prevState,
      rows: filtered,
    }));
    setEmptyGt2(filtered.length === 0);
  };

  // Handle edit button click
  const handleEditClick = (user) => {
    if (user.role !== "admin") {
      setSelectedUser(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        account_title: user.account_title || "",
        bank: user.bank || "",
      });
      setOpenEditPopup(true);
    }
  };

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmitForm = async () => {
    try {
      if (!formData.email || !formData.name || !formData.mobile) {
        toast.error("Name, email, and mobile are required.");
        return;
      }

      const response = await axios.post(
        "https://backend.salespronetworks.com/api/change-user",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("User updated successfully!");
      const updatedUser = response.data.user;

      const updateTableData = (setTableData, setOriginalRows) => {
        setTableData((prevState) => ({
          ...prevState,
          rows: prevState.rows.map((row) =>
            row.id === updatedUser.id
              ? {
                  ...row,
                  name: updatedUser.name,
                  account_title: updatedUser.account_title,
                  email: updatedUser.email,
                  mobile: updatedUser.mobile,
                  bank: updatedUser.bank,
                }
              : row
          ),
        }));
        setOriginalRows((prevRows) =>
          prevRows.map((row) =>
            row.id === updatedUser.id
              ? {
                  ...row,
                  name: updatedUser.name,
                  account_title: updatedUser.account_title,
                  email: updatedUser.email,
                  mobile: updatedUser.mobile,
                  bank: updatedUser.bank,
                }
              : row
          )
        );
      };

      if (updatedUser && updatedUser.stars <= 2) {
        updateTableData(setTableDataLte2, setOriginalRowsLte2);
      } else if (updatedUser && updatedUser.stars > 2) {
        updateTableData(setTableDataGt2, setOriginalRowsGt2);
      }

      setOpenEditPopup(false);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error("Error updating user. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Users with <= 2 stars */}
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
                  Users with less than 2 stars
                </MDTypography>
              </MDBox>
              {/* Search Bar for <= 2 stars */}
              <MDBox pt={3} px={2}>
                <TextField
                  fullWidth
                  label="Search by Name, Email, or Mobile"
                  variant="outlined"
                  value={searchTermLte2}
                  onChange={handleSearchLte2}
                  margin="normal"
                />
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <Grid container justifyContent="center">
                    <CircularProgress />
                  </Grid>
                ) : emptyLte2 ? (
                  <MDBox textAlign="center" p={2}>
                    <MDTypography variant="h6" color="textSecondary">
                      No users found.
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

          {/* Users with > 2 stars */}
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
                  Users with more than 2 stars
                </MDTypography>
              </MDBox>
              {/* Search Bar for > 2 stars */}
              <MDBox pt={3} px={2}>
                <TextField
                  fullWidth
                  label="Search by Name, Email, or Mobile"
                  variant="outlined"
                  value={searchTermGt2}
                  onChange={handleSearchGt2}
                  margin="normal"
                />
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <Grid container justifyContent="center">
                    <CircularProgress />
                  </Grid>
                ) : emptyGt2 ? (
                  <MDBox textAlign="center" p={2}>
                    <MDTypography variant="h6" color="textSecondary">
                      No users found.
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
        </Grid>
      </MDBox>

      {/* Edit User Dialog */}
      <Dialog open={openEditPopup} onClose={() => setOpenEditPopup(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Account Title"
            fullWidth
            name="account_title"
            value={formData.account_title}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            label="Mobile"
            fullWidth
            name="mobile"
            value={formData.mobile}
            onChange={handleFormChange}
            margin="normal"
          />
          <TextField
            label="Bank"
            fullWidth
            name="bank"
            value={formData.bank}
            onChange={handleFormChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditPopup(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitForm} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default AllUsers;
