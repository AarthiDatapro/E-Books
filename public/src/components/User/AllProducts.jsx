import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaFilePdf, FaUser, FaBook, FaLayerGroup, FaRupeeSign, FaBox, FaSave, FaTimes } from "react-icons/fa";

import {
  // findSimilarProductsRoute,
  getAllProductsRoute,
} from "../../utils/APIRoutes";
import { host } from "../../utils/APIRoutes";
import "../../styles/AllProducts.css";
import { useNavigate } from "react-router-dom";
import { Mic, Image as ImageIcon } from "lucide-react";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [flyingItems, setFlyingItems] = useState([]);
  const [inputText, setInputText] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    product: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(getAllProductsRoute);
        if (res.data.status) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // Load cart items from localStorage
    const savedCartItems = JSON.parse(localStorage.getItem("bookCartItems")) || [];
    setCartItems(savedCartItems);
  }, []);

  const handleAddToCart = (product) => {
    // Create a flying item
    const newFlyingItem = {
      id: Date.now(),
      productId: product._id,
      name: product.bookName,
      price: product.price,
    };

    // Add to flying items
    setFlyingItems((prev) => [...prev, newFlyingItem]);

    // Remove the flying item after animation
    setTimeout(() => {
      setFlyingItems((prev) =>
        prev.filter((item) => item.id !== newFlyingItem.id)
      );
    }, 800);

    // Add to cart
    const updatedCartItems = [...cartItems];
    const productExists = updatedCartItems.some(
      (item) => item._id === product._id
    );

    if (!productExists) {
      updatedCartItems.push({
        ...product,
        total_price: product.price,
      });
      localStorage.setItem("bookCartItems", JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);

      // Show new notification
      setNotification({
        show: true,
        product: product,
      });

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      category === "All" ||
      product.category?.toLowerCase() === category.toLowerCase();
    const matchesSearch =
      product.bookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  const handleSubmit = () => {
    setSearchQuery(inputText);
  };

  const startSpeechRecognition = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    setIsListening(true); // Set mic to active

    recognition.onresult = (event) => {
      setInputText(
        event.results[0][0].transcript
          .replace(/[.'’"‘”]+$/, "") // remove trailing punctuation
          .replace(/['’‘"]/g, "") // remove all apostrophes and quotes from anywhere
      );
      setIsListening(false); // Reset mic to inactive
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false); // Reset mic to inactive
    };

    recognition.onend = () => {
      setIsListening(false); // Also handle when user stops talking
    };
  };


  const handleProductDetails = (productId) => {
    navigate("/productDetails", { state: { productId } });
  }


  return (
    <div className="products-page">
      <div className="products-header">
        <h2>Discover Our Collection</h2>
        <p className="header-subtitle">
          Explore our curated selection of premium products
        </p>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="search-input"
          />
          <button
            onClick={startSpeechRecognition}
            style={{
              backgroundColor: isListening ? "#ff4d4f" : "",
              transition: "background-color 0.3s",
            }}
          >
            <Mic size={15} />
          </button>
          {/* <label>
            <ImageIcon size={20} />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label> */}
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <div className="category-buttons">
          <button
            className={`category-btn ${category === "All" ? "active" : ""}`}
            onClick={() => setCategory("All")}
          >
            All Products
          </button>
          <button
            className={`category-btn ${category === "Men" ? "active" : ""}`}
            onClick={() => setCategory("fiction")}
          >
            Fiction Collection
          </button>
          <button
            className={`category-btn ${category === "Women" ? "active" : ""}`}
            onClick={() => setCategory("non-fiction")}
          >
            Non Fiction Collection
          </button>
        </div>
      </div>

      <div className="user-products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="user-product-card">
              <div className="user-product-image-container">
                <img
                  src={`${host}/uploads/images/${product.category}/${product.subCategory}/${product.bookImage}`}
                  alt={product.bookName}
                  className="user-product-image"
                />
                <div className="user-product-overlay">
                  <button
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="user-product-details" onClick={() => handleProductDetails(product._id)}>
                <h3 className="product-name">{product.bookName}</h3>
                <p className="product-description">{product.description}</p>
                <div className="meta-item" style={{ marginTop: "10px" }}>
                  <FaUser /> {product.author}
                </div>
                <div className="meta-item">
                  <FaBook /> {product.category}
                </div>
                <div className="meta-item">
                  <FaLayerGroup /> {product.subCategory}
                </div>
                <div className="product-price">INR {product.price}</div>
              </div>
            </div>
          )) 
        ) : (
          <div className="no-products">
            <div className="no-products-icon">🛍️</div>
            <p>No products found in this category</p>
          </div>
        )}
      </div>

      {flyingItems.map((item) => (
        <div key={item.id} className="flying-item">
          ₹{item.price}
        </div>
      ))}

      <div className={`cart-notification ${notification.show ? "show" : ""}`}>
        {notification.product && (
          <>
            <div className="cart-notification-image">
              <img
                src={`${host}/uploads/images/${notification.product.category}/${notification.product.subCategory}/${notification.product.bookImage}`}
                alt={notification.product.bookName}
              />
            </div>
            <div className="cart-notification-content">
              <h4 className="cart-notification-title">
                {notification.product.bookName}
              </h4>
              <p className="cart-notification-price">
                ₹{notification.product.price}
              </p>
            </div>
            <div
              className="cart-notification-close"
              onClick={() =>
                setNotification((prev) => ({ ...prev, show: false }))
              }
            >
              ×
            </div>
          </>
        )}
      </div>

      <div className="cart-icon-container">
        <div className="cart-icon"></div>
        <div
          className={`cart-notification-dot ${cartItems.length === 0 ? "empty" : ""
            }`}
        >
          {cartItems.length}
        </div>
      </div>
    </div>
  );
}

export default AllProducts;
