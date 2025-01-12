import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { InputAdornment, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

function ProductList() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    accountType: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("authToken");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [errors, setErrors] = useState({}); // To store backend validation errors

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://ecosphere-pakistan-backend.co-m.pk/api/all-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleOpen = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      image: product.image,
      accountType: product.category.toString(),
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setFormData({
      name: "",
      description: "",
      image: null,
      accountType: "",
    });
    setErrors({}); // Clear errors when closing the modal
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description) {
      toast.error("All fields are required.");
      console.log("Missing fields:", {
        name: !formData.name,
        description: !formData.description,
      });
      return;
    }

    try {
      setIsLoading(true);
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("description", formData.description);

      for (let [key, value] of formDataObj.entries()) {
        console.log(key, value);
      }

      for (let [key, value] of formDataObj.entries()) {
        console.log(key, value);
      }

      const response = await axios.put(
        `https://ecosphere-pakistan-backend.co-m.pk/api/edit-product/${selectedProduct.id}`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        toast.success("Product updated successfully!");
        handleClose();
        fetchProducts();
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        toast.error("Validation errors occurred. Please check the form.");
      } else {
        toast.error(err.response?.data?.message || "Failed to update product.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category.toString() === selectedCategory);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          All Products
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Category</InputLabel>
          <Select value={selectedCategory} onChange={handleCategoryChange} label="Category">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="1">1 Account</MenuItem>
            <MenuItem value="3">3 Accounts</MenuItem>
            <MenuItem value="7">7 Accounts</MenuItem>
          </Select>
        </FormControl>

        <Grid container spacing={3}>
          {filteredProducts?.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia component="img" height="150" image={product.image} alt={product.name} />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    style={{ color: "white" }}
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleOpen(product)}
                  >
                    Edit Product
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
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
                error={!!errors.name}
                helperText={errors.name ? errors.name[0] : ""}
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
                error={!!errors.description}
                helperText={errors.description ? errors.description[0] : ""}
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
                  onClick={handleSubmit}
                >
                  {isLoading ? "Editing..." : "Edit Product"}
                </Button>
              </MDBox>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default ProductList;
