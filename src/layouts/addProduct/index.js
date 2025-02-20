import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function AddProduct() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [], // Array to store multiple images
    accountType: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      const newImages = Array.from(files); // Convert FileList to an array
      setFormData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...newImages], // Append new files
      }));
      e.target.value = null;
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      formData.images.length === 0 ||
      !formData.accountType
    ) {
      toast.error("All fields are required.");
      return;
    }

    try {
      setIsLoading(true);

      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("description", formData.description);
      formDataObj.append("category", formData.accountType);

      formData.images.forEach((image) => {
        formDataObj.append("images[]", image);
      });

      const response = await axios.post(
        "https://backend.salespronetworks.com/api/add-product",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("Product added successfully!");
        setFormData({
          name: "",
          description: "",
          images: [],
          accountType: "",
        });
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product.");
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
              Add Product
            </MDTypography>
          </MDBox>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Description"
                  name="description"
                  variant="outlined"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: "none" }}
                  id="image-upload"
                  multiple
                />
                <label htmlFor="image-upload">
                  <Button style={{ color: "gray" }} variant="outlined" component="span" fullWidth>
                    Upload Product Images
                  </Button>
                </label>
                {formData.images.length > 0 && (
                  <MDBox mt={2}>
                    <MDTypography variant="body2" color="textSecondary">
                      Selected Files:
                    </MDTypography>
                    <MDBox display="flex" flexWrap="wrap" gap={1} mt={1}>
                      {formData.images.map((image, index) => (
                        <MDTypography key={index} variant="caption" color="textSecondary">
                          {image.name}
                        </MDTypography>
                      ))}
                    </MDBox>
                  </MDBox>
                )}
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    label="Account Type"
                  >
                    <MenuItem value={1}>1 Account</MenuItem>
                    <MenuItem value={3}>3 Accounts</MenuItem>
                    <MenuItem value={7}>7 Accounts</MenuItem>
                  </Select>
                </FormControl>
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
                    {isLoading ? "Adding..." : "Add Product"}
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

export default AddProduct;