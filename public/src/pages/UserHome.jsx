import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AllProducts from "../components/User/AllProducts";
import Cart from "../components/User/Cart";
import "../styles/UserHome.css";

function UserHome() {
  const [content, setContent] = useState(<AllProducts />);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");
    if (refCode) {
      localStorage.setItem("refCode", refCode);
    }
  }, []);
  

  const handleClick = (page) => {
    setActiveTab(page);
    if (page === "all") {
      window.location.reload();
      setContent(<AllProducts />);
    } else if (page === "cart") {
      setContent(<Cart />);
    } else if (page === "logout") {
      localStorage.removeItem("bookShopCurrentUser");
      navigate("/");
    }
  };

  return (
    <div className="user-home-container">
      <nav className="user-nav">
        <div className="nav-brand">
          <h1>E-Books Shop</h1>
        </div>
        <div className="nav-links">
          <button
            className={`nav-link ${activeTab === "all" ? "active" : ""}`}
            onClick={() => handleClick("all")}
          >
            <span className="icon">🛍️</span>
            <span className="text">All Products</span>
          </button>
          <button
            className={`nav-link ${activeTab === "cart" ? "active" : ""}`}
            onClick={() => handleClick("cart")}
          >
            <span className="icon">🛒</span>
            <span className="text">Cart</span>
          </button>
          <button
            className="nav-link logout"
            onClick={() => handleClick("logout")}
          >
            <span className="icon">🚪</span>
            <span className="text">Logout</span>
          </button>
        </div>
      </nav>
      <main className="content-area">{content}</main>
    </div>
  );
}

export default UserHome;
