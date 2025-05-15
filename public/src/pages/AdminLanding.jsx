import React, { useEffect, useState } from "react";
import AddProduct from "../components/Admin/AddProduct";
import MyProducts from "../components/Admin/MyProducts";
import { useNavigate } from "react-router-dom";
import AddAffile from "../components/Admin/AddAffile";
import "../styles/AdminLanding.css";
import AffileProfits from "../components/Admin/AffileProfits";
import AdminMessages from "../components/Admin/AdminMessages";
import ViewAffiliator from "../components/Admin/ViewAffiliator";

function AdminLanding() {
  const [content, setContent] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("bookShopCurrentUser");
    if (!user) {
      navigate("/");
    } else {
      navigate("/adminHome");
    }
  }, [navigate]);

  const handleClick = (page) => {
    setActivePage(page);
    setSidebarOpen(false); // Close sidebar on mobile when an item is clicked
    if (page === "add") {
      setContent(<AddProduct />);
    } else if (page === "view") {
      setContent(<MyProducts />);
    } else if (page === "msgs") {
      setContent(<AdminMessages />);
    } else if (page === "profits") {
      setContent(<AffileProfits />);
    } else if (page === "affile") {
      setContent(<AddAffile />);
    }    else if (page === "Viewaffile") {
      setContent(<ViewAffiliator />);
    } else if (page === "logout") {
      localStorage.removeItem("bookShopCurrentUser");
      navigate("/");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-mobile-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <h1 className="mobile-dashboard-title">Admin Dashboard</h1>
      </div>

      <div className={`admin-sidebar ${sidebarOpen ? "show-sidebar" : ""}`}>
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Manage your products</p>
        </div>
        <div className="admin-menu">
          <div
            className={`menu-item ${activePage === "msgs" ? "active" : ""}`}
            onClick={() => handleClick("msgs")}
          >
            <i className="fas fa-user-plus"></i>
            View Messages
          </div>
          <div
            className={`menu-item ${activePage === "view" ? "active" : ""}`}
            onClick={() => handleClick("view")}
          >
            <i className="fas fa-box"></i>
            View My Products
          </div>
          <div
            className={`menu-item ${activePage === "profits" ? "active" : ""}`}
            onClick={() => handleClick("profits")}
          >
            <i className="fas fa-box"></i>
            Analyze Profits
          </div>
          <div
            className={`menu-item ${activePage === "add" ? "active" : ""}`}
            onClick={() => handleClick("add")}
          >
            <i className="fas fa-plus"></i>
            Add Product
          </div>
          <div
            className={`menu-item ${activePage === "affile" ? "active" : ""}`}
            onClick={() => handleClick("affile")}
          >
            <i className="fas fa-user-plus"></i>
            Add Affiliator
          </div>
          <div
            className={`menu-item ${activePage === "Viewaffile" ? "active" : ""}`}
            onClick={() => handleClick("Viewaffile")}
          >
            <i className="fas fa-user-plus"></i>
            View Affiliators
          </div>
          <div
            className="menu-item"
            style={{ backgroundColor: "rgb(167, 0, 0)", color: "white" }}
            onClick={() => handleClick("logout")}
          >
            <i className="fas fa-sign-out-alt"></i>
            Log out
          </div>
        </div>
      </div>

      <div className="admin-content">
        {content || (
          <div className="welcome-message">
            <h2 className="welcome-title">Welcome to Admin Dashboard</h2>
            <p className="welcome-text">
              Select an option from the sidebar to get started with managing your products.
              You can view your existing products, add new ones, or manage affiliates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminLanding;
