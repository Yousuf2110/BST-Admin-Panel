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

import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function ChangePassword() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
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

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New Password and Confirm Password do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const payload = new URLSearchParams();
      payload.append("old_password", formData.oldPassword);
      payload.append("new_password", formData.newPassword);

      const response = await axios.post(
        "https://ecosphere-pakistan-backend.co-m.pk/api/change-password",
        payload,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("Password changed successfully!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change the password.");
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
              Change Password
            </MDTypography>
            <MDTypography variant="body2" color="textSecondary">
              اپنا اکاؤنٹ نئے پاس ورڈ کے ساتھ بحال کریں۔
            </MDTypography>
          </MDBox>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Old Password"
                  placeholder="یہاں پرانا پاس ورڈ لکھیں۔"
                  name="oldPassword"
                  variant="outlined"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  type={showPassword.oldPassword ? "text" : "password"}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: "black" }} />,
                    endAdornment: (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handlePasswordVisibilityToggle("oldPassword")}
                      >
                        {showPassword.oldPassword ? (
                          <Visibility sx={{ color: "black" }} />
                        ) : (
                          <VisibilityOff sx={{ color: "black" }} />
                        )}
                      </span>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  variant="outlined"
                  placeholder="یہاں نیا پاس ورڈ لکھیں۔"
                  value={formData.newPassword}
                  onChange={handleChange}
                  type={showPassword.newPassword ? "text" : "password"}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: "black" }} />,
                    endAdornment: (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handlePasswordVisibilityToggle("newPassword")}
                      >
                        {showPassword.newPassword ? (
                          <Visibility sx={{ color: "black" }} />
                        ) : (
                          <VisibilityOff sx={{ color: "black" }} />
                        )}
                      </span>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="پاس ورڈ کی تصدیق کریں۔"
                  variant="outlined"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  type={showPassword.confirmPassword ? "text" : "password"}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: "black" }} />,
                    endAdornment: (
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handlePasswordVisibilityToggle("confirmPassword")}
                      >
                        {showPassword.confirmPassword ? (
                          <Visibility sx={{ color: "black" }} />
                        ) : (
                          <VisibilityOff sx={{ color: "black" }} />
                        )}
                      </span>
                    ),
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
                    {isLoading ? "Submitting..." : "Change Password"}
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

export default ChangePassword;
