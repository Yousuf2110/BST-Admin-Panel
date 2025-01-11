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

function ProductList() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentScreenshot: null,
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const token = localStorage.getItem("authToken");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://ecosphere-pakistan-backend.co-m.pk/api/all-products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("Fetched Products:", data.products);
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, paymentScreenshot: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = () => {
    console.log("Form Submitted:", formData);
    setOpen(false);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category.toString() === selectedCategory);

  console.log("Filtered Products:", filteredProducts);

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
            <MenuItem value="1"> 1 Account</MenuItem>
            <MenuItem value="2">3 Account</MenuItem>
            <MenuItem value="3">7 Account</MenuItem>
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
                    onClick={handleOpen}
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
          <Typography variant="h6" mb={2}>
            Purchase Form
          </Typography>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            placeholder="اپنے قریبی ڈاک خانہ کا مکمل پتہ لکھیں"
            value={formData.address}
            onChange={handleInputChange}
            margin="normal"
          />
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Payment Screenshot"
              value={formData.paymentScreenshot ? "Screenshot Selected" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Button component="label" startIcon={<PhotoCamera />} size="small">
                      Upload
                      <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </Button>
                  </InputAdornment>
                ),
              }}
              disabled
            />
            {formData.paymentScreenshot && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={formData.paymentScreenshot}
                  alt="Payment Screenshot"
                  style={{ maxWidth: "100%", maxHeight: "150px" }}
                />
              </Box>
            )}
          </Box>
          <Button
            style={{ color: "#fff" }}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default ProductList;
