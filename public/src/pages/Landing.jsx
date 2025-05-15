import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import '../styles/Landing.css';
import { roleCases } from '../utils/constants';
import { loginRoute } from '../utils/APIRoutes';

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
                if (email === "aarthi@datapro.in" && password === "12345678") {
                    localStorage.setItem("bookShopCurrentUser", JSON.stringify({
                        email: email,
                        role: role
                    }));
                    navigate("/adminHome")
                }
                else{
                    toast.error("Error in loading page", toastOptions);
                }
            }
            else if (role === roleCases.SET_AFFILIATOR) {
                axios
                    .post(loginRoute, {
                        email,
                        password,
                        role,
                    })
                    .then((res) => {
                        if (res.data.status === true) {
                            localStorage.setItem("bookShopCurrentUser", JSON.stringify(res.data.user));
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
            question: "How does the affiliate program work?",
            answer: "Our affiliate program allows you to earn commissions by promoting our e-books. You'll receive a unique tracking link and can earn up to 30% commission on each sale."
        },
        {
            question: "What types of e-books are available?",
            answer: "We offer a wide range of e-books across various genres including fiction, non-fiction, educational, business, and more. Our collection is constantly growing."
        },
        {
            question: "How do I get started as an affiliate?",
            answer: "Simply sign up for our affiliate program, get your unique tracking link, and start promoting our e-books through your preferred channels."
        }
    ];

    return (
        <div className="landing-container">
            {/* Navigation */}
            <nav className="navbar">
                <div className="logo">E-Books Platform</div>
                <div className="nav-links">
                    <button className="login-btn" onClick={() => handleLoginClick(roleCases.SET_AFFILIATOR)}>Affiliate Login</button>
                    <button className="login-btn" onClick={() => handleLoginClick(roleCases.SET_ADMIN)}>Admin Login</button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to E-Books Platform</h1>
                    <p>Your one-stop destination for digital reading and affiliate opportunities</p>
                    <div className="cta-buttons">
                        <button className="primary-btn" onClick={()=> navigate("/userHome")}>Get Started</button>
                        <button className="secondary-btn">Learn More</button>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="statistics">
                <div className="stats-container">
                    <div className="stat-item">
                        <h3>10,000+</h3>
                        <p>E-Books Available</p>
                    </div>
                    <div className="stat-item">
                        <h3>5,000+</h3>
                        <p>Active Affiliates</p>
                    </div>
                    <div className="stat-item">
                        <h3>30%</h3>
                        <p>Commission Rate</p>
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
                        <h3>Affiliate Program</h3>
                        <p>Earn commissions by promoting our e-books</p>
                    </div>
                    <div className="feature-card">
                        <h3>Easy Management</h3>
                        <p>Simple tools for affiliates and administrators</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
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
            </section>

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
                    <p>Join our platform today and start earning with our affiliate program</p>
                    <button className="primary-btn">Sign Up Now</button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>E-Books Platform</h3>
                        <p>Your trusted partner in digital reading and affiliate marketing</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/">About Us</Link></li>
                            <li><Link to="/">Contact</Link></li>
                            <li><Link to="/">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Contact Us</h4>
                        <p>Email: support@ebooksplatform.com</p>
                        <p>Phone: +1 (555) 123-4567</p>
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
                        <h2>{loginType === 'affiliate' ? 'Affiliate Login' : 'Admin Login'}</h2>
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