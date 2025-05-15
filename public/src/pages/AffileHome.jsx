import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserHome.css";
import AffiliatorMessages from "../components/Affiliator/AffiliatorMessages";
import AffiliatorLanding from "../components/Affiliator/AffiliatorLanding";

function AffileHome() {
    const [content, setContent] = useState(<AffiliatorMessages />);
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
        if (page === "msgs") {
            setContent(<AffiliatorMessages />);
        } else if (page === "nlysis") {
            setContent(<AffiliatorLanding />);
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
                        className={`nav-link ${activeTab === "msgs" ? "active" : ""}`}
                        onClick={() => handleClick("msgs")}
                    >
                        <span className="icon">💬</span>
                        <span className="text">Messages</span>
                    </button>
                    <button
                        className={`nav-link ${activeTab === "nlysis" ? "active" : ""}`}
                        onClick={() => handleClick("nlysis")}
                    >
                        <span className="icon">📈</span>
                        <span className="text">Analysis</span>
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

export default AffileHome;
