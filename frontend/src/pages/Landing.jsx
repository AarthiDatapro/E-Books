import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import '../styles/Landing.css';
import { roleCases } from '../utils/constants';
import { loginRoute, secretKey } from '../utils/APIRoutes';
import logo from "../assests/logo.png";

function Landing() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginType, setLoginType] = useState('');
    const [activeFaq, setActiveFaq] = useState(null);
    const navigate = useNavigate();

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const [values, setValues] = useState({
        email: "",
        password: "",
        role: loginType,
    })

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleLoginClick = (type) => {
        setLoginType(type);
        setValues(prev => ({ ...prev, role: type }));
        setShowLoginModal(true);
    };

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };



    const handleValidation = () => {
        const { email, password } = values;
        if (email === "") {
            toast.error("Email is required", toastOptions);
            return false;
        } else if (password === "") {
            toast.error("Password is required", toastOptions);
            return false;
        }
        return true;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const { email, password, role } = values;
            console.log(values)
            if (role === roleCases.SET_ADMIN) {
                if (email === "mahi@mahicommunity.com" && password === "Mahicommunity@com") {
                    localStorage.setItem("bookShopCurrentUser", JSON.stringify({
                        email: email,
                        role: role
                    }));
                    navigate("/adminHome")
                }
                else {
                    toast.error("Error in loading page", toastOptions);
                }
            }
            else if (role === roleCases.SET_AFFILIATOR) {
                axios
                    .post(loginRoute, {
                        email,
                        password,
                        role,
                    }, {
                        headers: {
                            "api-key": secretKey
                        }
                    })
                    .then((res) => {
                        if (res.data.status === true) {
                            const { password, phoneNumber, ...safeUser } = res.data.user;
                            localStorage.setItem("bookShopCurrentUser", JSON.stringify(safeUser));
                            navigate("/affiliatorHome")
                        } else if (res.data.status === false) {
                            toast.error(res.data.msg, toastOptions);
                        }
                    });
            }
        }
    };



    const faqs = [
        {
            question: "Are the e-books compatible with all devices?",
            answer: "Yes, our e-books are provided in formats compatible with most devices including smartphones, tablets, e-readers, and computers."
        },
        {
            question: "Can I preview an e-book before purchasing?",
            answer: "Absolutely! Many of our e-books offer a free sample preview so you can get a glimpse of the content before making a purchase."
        },
        {
            question: "How will I receive the e-book after purchase?",
            answer: "After purchasing, you will receive a download link instantly via email. You can also access your purchased e-books from your account dashboard."
        }
    ];

    return (
        <div className="landing-container">
            {/* Navigation */}
            <nav className="navbar">
                <div className="logo">Mahi Community</div>
                <div className="nav-links">
                    <button className="login-btn" onClick={() => handleLoginClick(roleCases.SET_AFFILIATOR)}>Affiliate Login</button>
                    <button className="login-btn" onClick={() => handleLoginClick(roleCases.SET_ADMIN)}>Admin Login</button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <img src={logo} alt="" className='hero-img' />
                    <h1 className='hero-h1'>Welcome to MAHI COMMUNITY</h1>
                    <p>Your one stop destination for digital reading</p>
                    <div className="cta-buttons">
                        <button className="primary-btn" onClick={() => navigate("/userHome")}>Get Started</button>
                        {/* <button className="secondary-btn">Learn More</button> */}
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="statistics">
                <div className="stats-container">
                    <div className="stat-item">
                        <h3>100%</h3>
                        <p>Secure Payments</p>
                    </div>
                    <div className="stat-item">
                        <h3>Instant</h3>
                        <p>PDF Downloads</p>
                    </div>
                    <div className="stat-item">
                        <h3>Curated</h3>
                        <p>Reading Lists</p>
                    </div>
                    <div className="stat-item">
                        <h3>24/7</h3>
                        <p>Support Available</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2>Why Choose Us?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Wide Selection</h3>
                        <p>Access thousands of e-books across various genres</p>
                    </div>
                    <div className="feature-card">
                        <h3>Easy Understanding</h3>
                        <p>Simple, clear and easily comprehended</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section
            <section className="testimonials">
                <h2>What Our Affiliates Say</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="testimonial-content">
                            <p>"The platform has transformed my online business. The commission structure is generous and the support team is always helpful."</p>
                            <div className="testimonial-author">
                                <h4>Sarah Johnson</h4>
                                <p>Top Affiliate</p>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-content">
                            <p>"I've been able to build a sustainable income stream through this platform. The analytics tools are excellent for tracking performance."</p>
                            <div className="testimonial-author">
                                <h4>Michael Chen</h4>
                                <p>Digital Marketer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* FAQ Section */}
            <section className="faq">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-container">
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <div className="faq-question" onClick={() => toggleFaq(index)}>
                                <h3>{faq.question}</h3>
                                <span className={`faq-icon ${activeFaq === index ? 'active' : ''}`}>+</span>
                            </div>
                            {activeFaq === index && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Start Your Journey?</h2>
                    <button className="primary-btn" onClick={() => {
                        document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
                    }}>Contact Us Now</button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" id='footer'>
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Mahi Community</h3>
                        <p>Your trusted partner in digital reading</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/terms-and-conditions">Terms and Conditions</Link></li>
                            <li><Link to="/cancel-and-refund-policy">Cancel and Refund Policy</Link></li>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Contact Us</h4>
                        <p>Email: mahi@mahicommunity.com</p>
                        <p>54-2-63, Isukathota, Visakhapatnam, Andhra Pradesh - 530022</p>
                        <p>Phone: +91 7989611470</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 E-Books Platform. All rights reserved.</p>
                </div>
            </footer>

            {/* Login Modal */}
            {showLoginModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{loginType === roleCases.SET_AFFILIATOR ? 'Affiliate Login' : 'Admin Login'}</h2>
                        <form className="login-form" onSubmit={handleSubmit}>
                            <input type="email" placeholder="Email" required name='email' value={values.email} onChange={(e) => handleChange(e)} />
                            <input type="password" placeholder="Password" required name='password' value={values.password} onChange={(e) => handleChange(e)} />
                            <button type="submit" className="primary-btn" >Login</button>
                            <button type="button" className="secondary-btn" onClick={() => setShowLoginModal(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default Landing;
