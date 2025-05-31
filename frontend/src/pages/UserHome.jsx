import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AllProducts from "../components/User/AllProducts";
import Cart from "../components/User/Cart";
import "../styles/UserHome.css";

function UserHome() {
  const [content, setContent] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const refCode = localStorage.getItem("refCode");

    if (!refCode) {
      localStorage.setItem("refCode", "hero")
    }

    setContent(
      <AllProducts
        onShowCart={() => {
          setActiveTab("cart");
          setContent(<Cart />);
        }}
      />
    );
  }, []);




  const handleClick = (page) => {
    setActiveTab(page);
    if (page === "all") {
      // Instead of reload, just set content to AllProducts again
      setContent(
        <AllProducts
          onShowCart={() => {
            setActiveTab("cart");
            setContent(<Cart />);
          }}
        />
      );
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
          <h1>Mahi Community</h1>
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
