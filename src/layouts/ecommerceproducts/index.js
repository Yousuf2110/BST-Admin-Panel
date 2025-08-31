// ProductList.js - Admin Product Management (Add, Edit, Delete)
import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Container,
  Grid,
  Modal,
  Box,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";
import { Add, Edit, Close ,Delete  } from "@mui/icons-material";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function ProductList() {
  // Initial product data
  const [products, setProducts] = useState([
    {
      id: 1,
      img: "https://backend.salespronetworks.com/storage/screenshots/6c844c74-2489-42d3-9f20-c5497268186c.jpg",
      title: "Smartphone X",
      description: "Latest smartphone with triple camera, 128GB storage, and fast charging.",
      price: "$699.99",
      salePrice: "$599.99",
    },
    {
      id: 2,
      img: "https://backend.salespronetworks.com/storage/screenshots/6c844c74-2489-42d3-9f20-c5497268186c.jpg",
      title: "Pro Tablet",
      description: "10-inch tablet with stylus support and high-resolution display.",
      price: "$399.99",
      salePrice: "$349.99",
    },
    {
      id: 3,
      img: "https://backend.salespronetworks.com/storage/screenshots/6c844c74-2489-42d3-9f20-c5497268186c.jpg",
      title: "Gaming Mouse",
      description: "High-DPI gaming mouse with customizable buttons and ergonomic design.",
      price: "$79.99",
      salePrice: "$59.99",
    },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    salePrice: "",
    img: "",
  });

  // Open modal for Add or Edit
  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product });
    } else {
      setEditingProduct(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        salePrice: "",
        img: "",
      });
    }
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProduct(null);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save product (Add or Update)
  const handleSaveProduct = () => {
    const { title, description, price, salePrice, img } = formData;

    if (!title || !description || !price || !salePrice || !img) {
      alert("All fields are required!");
      return;
    }

    if (editingProduct) {
      // Update
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...formData, id: p.id } : p))
      );
    } else {
      // Add new
      const newProduct = {
        id: Date.now(), // Simple unique ID
        ...formData,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }

    handleCloseModal();
  };

  // Delete product
  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <MDTypography variant="h4" fontWeight="bold">
            Product Management
          </MDTypography>
          <Button
            variant="contained"
            color="info"
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
          >
            Add Product
          </Button>
        </MDBox>

        {/* Product Grid */}
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
                }}
              >
                {/* Image */}
                <CardMedia
                  component="img"
                  height="180"
                  image={product.img}
                  alt={product.title}
                  sx={{ objectFit: "cover" }}
                />

                {/* Content */}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {product.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      mb: 2,
                    }}
                  >
                    {product.description}
                  </Typography>

                  {/* Prices */}
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={product.salePrice}
                      color="error"
                      size="small"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.85rem",
                        mr: 1,
                      }}
                    />
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textDecoration: "line-through",
                      }}
                    >
                      {product.price}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box display="flex" justifyContent="space-between" mt="auto">
                    <Button
                      size="small"
                      color="warning"
                      startIcon={<Edit />}
                      onClick={() => handleOpenModal(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Add/Edit Product Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 500 },
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
            }}
          >
         <IconButton
  onClick={handleCloseModal}
  sx={{
    position: "absolute",
    top: 8,
    right: 8,
    color: "text.secondary",
    bgcolor: "grey.100",
    "&:hover": {
      bgcolor: "grey.200",
    },
  }}
>
  <Close /> {/* This is the cross icon */}
</IconButton>
            <Typography variant="h5" fontWeight="bold" align="center" mb={3}>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </Typography>

            <Box component="form" noValidate>
              <TextField
                label="Product Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Original Price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
                placeholder="$699.99"
              />
              <TextField
                label="Sale Price"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
                placeholder="$599.99"
              />
              <TextField
                label="Image URL"
                name="img"
                value={formData.img}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />

              <Button
                variant="contained"
                color="info"
                fullWidth
                size="large"
                sx={{ mt: 3, py: 1.2, fontWeight: "bold" }}
                onClick={handleSaveProduct}
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </DashboardLayout>
  );
}

export default ProductList;