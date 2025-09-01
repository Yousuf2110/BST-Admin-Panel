import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState, useRef } from "react";

function ProductManagement() {
  // Initial product data
  const [products, setProducts] = useState([
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop",
      title: "iPhone 15 Pro",
      description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system for professional photography.",
      price: "$999.99",
      salePrice: "$899.99",
      category: "Electronics",
      stock: 25,
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&h=200&fit=crop",
      title: "MacBook Pro 16\"",
      description: "Powerful laptop with M3 chip, stunning Liquid Retina XDR display, perfect for creative professionals.",
      price: "$2499.99",
      salePrice: "$2299.99",
      category: "Computers",
      stock: 12,
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop",
      title: "Sony WH-1000XM5",
      description: "Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.",
      price: "$399.99",
      salePrice: "$299.99",
      category: "Audio",
      stock: 18,
    },
    {
      id: 4,
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
      title: "Apple Watch Series 9",
      description: "Advanced smartwatch with health monitoring, fitness tracking, and seamless iPhone integration.",
      price: "$429.99",
      salePrice: "$379.99",
      category: "Wearables",
      stock: 30,
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
    category: "",
    stock: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Open modal for Add or Edit
  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ ...product });
      setImagePreview(product.img);
    } else {
      setEditingProduct(null);
      setFormData({
        title: "",
        description: "",
        price: "",
        salePrice: "",
        img: "",
        category: "",
        stock: "",
      });
      setImagePreview(null);
    }
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(!openModal);
    setEditingProduct(null);
    setImagePreview(null);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result;
        setImagePreview(imageDataUrl);
        setFormData((prev) => ({ ...prev, img: imageDataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, img: "" }));
    fileInputRef.current.value = "";
  };

  // Save product (Add or Update)
  const handleSaveProduct = () => {
    const { title, description, price, salePrice, img, category, stock } = formData;

    if (!title || !description || !price || !salePrice || !img || !category || !stock) {
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
        id: Date.now(),
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

  const getStockStatus = (stock) => {
    if (stock > 20) return { class: 'high', color: '#4caf50' };
    if (stock > 10) return { class: 'medium', color: '#ff9800' };
    return { class: 'low', color: '#f44336' };
  };

  const getCategoryColor = (category) => {
    const colors = {
      Electronics: "#667eea",
      Computers: "#764ba2",
      Audio: "#43a047",
      Wearables: "#ff7043"
    };
    return colors[category] || "#667eea";
  };

  const totalValue = products.reduce((sum, p) => sum + parseFloat(p.price?.replace('$', '') || 0), 0);
  const totalStock = products.reduce((sum, p) => sum + parseInt(p.stock || 0), 0);
  const uniqueCategories = [...new Set(products.map(p => p.category))].length;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '2rem',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {/* Header Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <h1 style={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  margin: '0 0 0.5rem 0',
                }}>
                  Product Management
                </h1>
                <p style={{
                  color: '#666',
                  fontSize: '1.2rem',
                  margin: 0,
                }}>
                  Manage your product inventory with ease
                </p>
              </div>
              <button
                onClick={() => handleOpenModal()}
                style={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '15px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>+</span>
                Add New Product
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}>
            {[
              { title: "Total Products", value: products.length, icon: "🛍️", color: "#667eea" },
              { title: "Total Stock", value: totalStock, icon: "📦", color: "#43a047" },
              { title: "Categories", value: uniqueCategories, icon: "🏷️", color: "#ff7043" },
              { title: "Total Value", value: `$${totalValue.toFixed(2)}`, icon: "💰", color: "#764ba2" },
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'transform 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: stat.color,
                    marginBottom: '0.5rem',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    color: '#666',
                    fontWeight: '500',
                  }}>
                    {stat.title}
                  </div>
                </div>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Product Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
          }}>
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              const savings = (parseFloat(product.price.replace('$', '')) - parseFloat(product.salePrice.replace('$', ''))).toFixed(2);

              return (
                <div key={product.id} style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {/* Image Section */}
                  <div style={{
                    position: 'relative',
                    height: '250px',
                    overflow: 'hidden',
                  }}>
                    <img
                      src={product.img}
                      alt={product.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                    />

                    {/* Badges */}
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      left: '15px',
                      right: '15px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}>
                      <span style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '25px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: getCategoryColor(product.category),
                        backdropFilter: 'blur(10px)',
                      }}>
                        {product.category}
                      </span>

                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '2rem' }}>
                    <h3 style={{
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                      marginBottom: '1rem',
                      background: 'linear-gradient(45deg, #333, #666)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {product.title}
                    </h3>

                    <p style={{
                      color: '#666',
                      lineHeight: '1.6',
                      marginBottom: '1.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {product.description}
                    </p>

                    {/* Pricing */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '0.5rem',
                      }}>
                        <span style={{
                          fontSize: '1.8rem',
                          fontWeight: 'bold',
                          background: 'linear-gradient(45deg, #e91e63, #f44336)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}>
                          {product.salePrice}
                        </span>
                      
                      </div>
                     
                    </div>

                    {/* Divider */}
                    <div style={{
                      height: '1px',
                      background: 'linear-gradient(to right, transparent, #ddd, transparent)',
                      margin: '1rem 0',
                    }}></div>

                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                    }}>
                      <button
                        onClick={() => handleOpenModal(product)}
                        style={{
                          flex: 1,
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          border: '2px solid #667eea',
                          background: 'transparent',
                          color: '#667eea',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{
                          flex: 1,
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          border: '2px solid #f44336',
                          background: 'transparent',
                          color: '#f44336',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = 'rgba(244, 67, 54, 0.1)';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal */}
          {openModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '2rem',
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflow: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 24px 80px rgba(0, 0, 0, 0.2)',
              }}>
                {/* Modal Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '2rem',
                  position: 'relative',
                }}>
                  <button
                    onClick={() => setOpenModal(false)}
                    style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      color: 'white', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    ×
                  </button>

                  <h2 style={{
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    margin: '0 0 0.5rem 0',
                  }}>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h2>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    margin: 0,
                  }}>
                    {editingProduct ? "Update product information" : "Create a new product entry"}
                  </p>
                </div>

                {/* Modal Content */}
                <div style={{ padding: '2rem' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                  }}>
                    {/* Form Fields */}
                    {[
                      { name: 'title', label: 'Product Title', type: 'text', placeholder: 'Enter product title' },
                      { name: 'price', label: 'Price', type: 'text', placeholder: '$999.99' },
                      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter product description' },
                    ].map((field) => (
                      <div key={field.name} style={{
                        gridColumn: field.fullWidth ? '1 / -1' : 'auto',
                      }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontWeight: 'bold',
                          color: '#333',
                        }}>
                          {field.label}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            rows="4"
                            style={{
                              width: '100%',
                              padding: '1rem',
                              borderRadius: '10px',
                              border: '2px solid #ddd',
                              fontSize: '1rem',
                              fontFamily: 'inherit',
                              resize: 'vertical',
                              transition: 'border-color 0.3s ease',
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                          />
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            placeholder={field.placeholder}
                            style={{
                              width: '100%',
                              padding: '1rem',
                              borderRadius: '10px',
                              border: '2px solid #ddd',
                              fontSize: '1rem',
                              fontFamily: 'inherit',
                              transition: 'border-color 0.3s ease',
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                          />
                        )}
                      </div>
                    ))}

                    {/* Image Upload Field */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: 'bold',
                        color: '#333',
                      }}>
                        Product Image
                      </label>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={{ display: 'none' }}
                      />

                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={handleUploadButtonClick}
                          style={{
                            padding: '1rem 1.5rem',
                            borderRadius: '10px',
                            border: '2px solid #667eea',
                            background: 'transparent',
                            color: '#667eea',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = 'transparent';
                          }}
                        >
                          Upload Image
                        </button>

                        {imagePreview && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            style={{
                              padding: '1rem 1.5rem',
                              borderRadius: '10px',
                              border: '2px solid #f44336',
                              background: 'transparent',
                              color: '#f44336',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = 'rgba(244, 67, 54, 0.1)';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = 'transparent';
                            }}
                          >
                            Remove Image
                          </button>
                        )}
                      </div>

                      {/* Image Preview */}
                      {imagePreview && (
                        <div style={{ marginTop: '1rem' }}>
                          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Image Preview:</p>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                              maxWidth: '200px',
                              maxHeight: '150px',
                              borderRadius: '10px',
                              border: '2px solid #ddd'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveProduct}
                    style={{
                      width: '100%',
                      marginTop: '2rem',
                      padding: '1.2rem',
                      borderRadius: '15px',
                      border: 'none',
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: 'white',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
                    }}
                  >
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProductManagement;