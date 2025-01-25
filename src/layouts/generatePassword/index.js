import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function GeneratedPassword() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordVisibilityToggle = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error("Email is required.");
      return;
    }

    try {
      setIsLoading(true);
      const payload = new URLSearchParams();
      payload.append("email", formData.email);

      const response = await axios.post(
        "https://backend.salespronetworks.com/api/change-password-request",
        payload,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("New password generated successfully!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generated new password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <MDBox display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <Card
          sx={{
            maxWidth: 500,
            width: "100%",
            padding: 4,
            borderRadius: 3,
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          }}
        >
          <MDBox textAlign="center" mb={3}>
            <MDTypography variant="h4" fontWeight="bold" color="textPrimary" gutterBottom>
              Generate Password
            </MDTypography>
          </MDBox>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  variant="outlined"
                  placeholder="اینیل یہاں درج کریں۔"
                  value={formData.pinToken}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <MDBox textAlign="center" mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                    sx={{
                      background: "linear-gradient(90deg, #ff512f, #dd2476)",
                      color: "#fff",
                      fontWeight: "bold",
                      padding: "12px",
                      textTransform: "uppercase",
                      "&:hover": {
                        background: "linear-gradient(90deg, #dd2476, #ff512f)",
                      },
                    }}
                  >
                    {isLoading ? "Generating..." : "Generate Password"}
                  </Button>
                </MDBox>
              </Grid>
            </Grid>
          </form>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default GeneratedPassword;
