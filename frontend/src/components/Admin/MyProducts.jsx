import React, { useEffect, useState } from "react";
import { useStateProvider } from "../../utils/StateProvider";
import axios from "axios";
import "../../styles/MyProducts.css";
import { getMyProductsRoute, host, editMyProductRoute, deleteMyProductRoute, toggleRestrictionRoute, secretKey } from "../../utils/APIRoutes";
import { FaEdit, FaTrash, FaFilePdf, FaUser, FaBook, FaLayerGroup, FaRupeeSign, FaBox, FaSave, FaTimes } from "react-icons/fa";

function MyProducts() {
  const { state } = useStateProvider();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(getMyProductsRoute, {
          headers: {
            "api-key": secretKey
          }
        });
        if (res.data.status === true && Array.isArray(res.data.products)) {
          console.log(res.data.products)
          const sortedProducts = res.data.products.sort((a, b) => {
            const aCount = a.monthlyOrderCount || 0;
            const bCount = b.monthlyOrderCount || 0;
            return bCount - aCount;
          });
          setProducts(sortedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [state.currentUser._id]);

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await axios.delete(`${deleteMyProductRoute}/${productId}`, {
        headers: {
          "api-key": secretKey
        }
      });
      if (res.data.status) {
        setProducts(products.filter((p) => p._id !== productId));
      } else {
        setError(res.data.msg || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(editMyProductRoute, {
        bookName: editingProduct.bookName,
        description: editingProduct.description,
        category: editingProduct.category,
        subCategory: editingProduct.subCategory,
        author: editingProduct.author,
        price: editingProduct.price,
        discPrice: editingProduct.discPrice,
        productId: editingProduct._id,
      }, {
        headers: {
          "api-key": secretKey
        }
      });

      if (res.data.status) {
        setProducts(products.map(p => p._id === editingProduct._id ? res.data.product : p));
        setEditingProduct(null);
      } else {
        setError(res.data.msg || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleRestriction = async (productId) => {
    try {
      const res = await axios.post(toggleRestrictionRoute, {
        productId: productId,
      }, {
        headers: {
          "api-key": secretKey
        }
      });
      if (res.data.status) {
        const updated = res.data.product;
        setProducts(products.map(p => p._id === updated._id ? updated : p));
        window.alert("Product restriction status updated successfully");
      } else {
        setError(res.data.msg || "Failed to toggle restriction");
      }
    } catch (err) {
      console.error("Error toggling restriction:", err);
      setError("Failed to toggle restriction");
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading your products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">
          <FaTrash />
        </div>
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={() => setError(null)}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="my-products-container">
      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaBook />
          </div>
          <h2 className="empty-message">No Products Found</h2>
          <p>Start by adding your first product to your inventory</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              {editingProduct?._id === product._id ? (
                <form className="edit-form" onSubmit={handleSave}>
                  <div className="form-group">
                    <label>Book Name</label>
                    <input
                      type="text"
                      name="bookName"
                      value={editingProduct.bookName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input type="text"
                      name="description"
                      value={editingProduct.description}
                      onChange={handleChange}
                      required />
                  </div>
                  <div className="form-group">
                    <label>Author</label>
                    <input
                      type="text"
                      name="author"
                      value={editingProduct.author}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      name="price"
                      value={editingProduct.price}
                      onChange={handleChange}
                      required
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Discount Price</label>
                    <input
                      type="number"
                      name="discPrice"
                      value={editingProduct.discPrice}
                      onChange={handleChange}
                      required
                      min="0"
                    />
                  </div>
                  <div className="form-buttons">
                    <button type="submit" className="save-button">
                      <FaSave /> Save
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setEditingProduct(null)}
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="book-image-container">
                    <img
                      className="book-detail-image"
                      src={`${host}/uploads/images/${product.category}/${product.subCategory}/${product.bookImage}`}
                      alt={product.bookName}
                    />
                    <div className="pdf-preview-overlay">
                      <a
                        href={`${host}/uploads/pdfs/${product.category}/${product.subCategory}/${product.bookPdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pdf-preview-link"
                      >
                        <FaFilePdf /> View PDF
                      </a>
                    </div>
                  </div>
                  <div className="product-details">
                    <h3 className="product-name">{product.bookName}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-meta">
                      <div className="meta-item">
                        <FaUser /> {product.author}
                      </div>
                      <div className="meta-item">
                        <FaBook /> {product.category}
                      </div>
                      <div className="meta-item">
                        <FaLayerGroup /> {product.subCategory}
                      </div>
                      <div className="meta-item" style={{ fontSize: "1rem", color: "green", fontWeight: "bold" }}>
                        Sales: {product.orderCount}
                      </div>
                    </div>
                    <div className="meta-item" style={{ fontSize: "1rem", color: "blue", fontWeight: "bold", margin: "10px 0px" }}>
                      Monthly Sales: {product.monthlyOrderCount}
                    </div>
                    <div className="price-quantity">
                      <div className="price">
                        <FaRupeeSign /> {product.price}
                      </div>
                      <div className="discPrice" >
                        {product.discPrice}
                      </div>
                    </div>
                    <button
                      className="action-button restriction-button"
                      onClick={() => handleRestriction(product._id)}
                    >
                      <FaTrash /> {product.restricted ? "Unrestrict" : "Restrict"}
                    </button>
                    <div className="action-buttons">
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEdit(product)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDelete(product._id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProducts;
