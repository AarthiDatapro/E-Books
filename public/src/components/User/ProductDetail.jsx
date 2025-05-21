import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { getProductDetailsRoute } from '../../utils/APIRoutes';
import { host } from "../../utils/APIRoutes";
import { useLocation, useNavigate } from 'react-router-dom';
import AllProducts from './AllProducts';
import Cart from './Cart';
import "../../styles/ProductDetail.css";
import { PDFDocument } from "pdf-lib";
import { toast, ToastContainer } from 'react-toastify';

function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [content, setContent] = useState();
    const [activeTab, setActiveTab] = useState("");
    const [notification, setNotification] = useState({ show: false, product: null });
    const [isDownloading, setIsDownloading] = useState(false);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const navigate = useNavigate();
    const location = useLocation();
    const { productId } = location.state || {};

    const handleClick = (page) => {
        navigate("/userHome");
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

    useEffect(() => {
        if (productId) {
            axios.post(getProductDetailsRoute, { productId })
                .then(response => {
                    setProduct(response.data.product);
                })
                .catch(error => {
                    console.error("Error fetching product details:", error);
                });
        }

        const savedCartItems = JSON.parse(localStorage.getItem("bookCartItems")) || [];
        setCartItems(savedCartItems);
    }, [productId]);

    const handleAddToCart = () => {
        if (!product) return;

        const updatedCartItems = [...cartItems];
        const productExists = updatedCartItems.some(item => item._id === product._id);

        if (!productExists) {
            updatedCartItems.push({
                ...product,
                total_quantity: 1,
                total_price: product.price,
            });
            localStorage.setItem("bookCartItems", JSON.stringify(updatedCartItems));
            setCartItems(updatedCartItems);

            setNotification({ show: true, product });

            setTimeout(() => {
                setNotification(prev => ({ ...prev, show: false }));
            }, 3000);
        } else {
            alert("Product already in cart!");
        }
    };



    const handleRequestSample = async () => {
        if (!product || isDownloading) return;

        setIsDownloading(true);

        try {
            if (!product.restricted) { // retriction added
                const pdfUrl = `${host}/uploads/pdfs/${product.category}/${product.subCategory}/${product.bookPdf}`;
                const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());

                const pdfDoc = await PDFDocument.load(existingPdfBytes);
                const newPdfDoc = await PDFDocument.create();

                const totalPages = pdfDoc.getPageCount();
                const pagesToCopy = Math.min(5, totalPages); // copy 2 pages, or less if total is smaller

                const copiedPages = await newPdfDoc.copyPages(pdfDoc, [...Array(pagesToCopy).keys()]);
                copiedPages.forEach((page) => newPdfDoc.addPage(page));

                const newPdfBytes = await newPdfDoc.save();

                const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = blobUrl;
                link.setAttribute('download', `Sample-${product.bookName}.pdf`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                URL.revokeObjectURL(blobUrl);
            }
            else{
                toast.error("Requested file is restricted to view", toastOptions);
            }
        } catch (err) {
            console.error('Error requesting sample:', err);
        } finally {
            setIsDownloading(false);
        }
    };




    return (
        <div>
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

            <div className="product-detail-container">
                {product ? (
                    <div className="product-detail-card">
                        <img
                            src={`${host}/uploads/images/${product.category}/${product.subCategory}/${product.bookImage}`}
                            alt={product.bookName}
                            className="product-image"
                        />
                        <div className="product-info">
                            <h2>{product.bookName}</h2>
                            <p id='productdetail-price'>{product.price}<sup>INR</sup></p>
                            <p><strong>Author:</strong> {product.author}</p>
                            <p><strong>Category:</strong> {product.category}</p>
                            <p><strong>Sub-Category:</strong> {product.subCategory}</p>
                            <p><strong>Description:</strong> {product.description}</p>

                            <div className="buttons">
                                <button className="btn add-to-cart" onClick={handleAddToCart}>
                                    Add to Cart
                                </button>
                                <button className="btn request-sample" onClick={handleRequestSample} disabled={isDownloading}>
                                    {isDownloading ? "Downloading..." : "Request Sample Book"}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading product details...</p>
                )}
            </div>

            {content}

            {/* Notification */}
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
                            <h4 className="cart-notification-title">{notification.product.bookName}</h4>
                            <p className="cart-notification-price">₹{notification.product.price}</p>
                        </div>
                        <div
                            className="cart-notification-close"
                            onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                        >
                            ×
                        </div>
                    </>
                )}
            </div>

            {/* Cart icon */}
            <div className="cart-icon-container" onClick={() => handleClick("cart")}>
                <div className="cart-icon">🛒</div>
                <div className={`cart-notification-dot ${cartItems.length === 0 ? "empty" : ""}`}>
                    {cartItems.length}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ProductDetail;
