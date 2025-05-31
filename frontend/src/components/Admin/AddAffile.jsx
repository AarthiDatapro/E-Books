import React, { useState } from 'react';
import { roleCases } from '../../utils/constants';
import axios from 'axios';
import { secretKey, signupRoute } from '../../utils/APIRoutes';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/AddAffile.css';

function AddAffile() {
    const [values, setValues] = useState({
        role: roleCases.SET_AFFILIATOR,
        username: "",
        email: "",
        phoneNumber: "",
        city: "",
        state: "",
        password: ""
    });

    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        specialChar: false,
    });

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));

        if (name === "password") {
            setPasswordChecks({
                length: value.length >= 8,
                lowercase: /[a-z]/.test(value),
                uppercase: /[A-Z]/.test(value),
                number: /\d/.test(value),
                specialChar: /[@$!%*?#&]/.test(value),
            });
        }
    };

    const handleValidation = () => {
        const { username, email, phoneNumber, city, state, password } = values;

        if (!username.trim()) {
            toast.error("Username is required", toastOptions);
            return false;
        }

        if (!email.trim()) {
            toast.error("Email is required", toastOptions);
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email", toastOptions);
            return false;
        }

        if (!phoneNumber.trim()) {
            toast.error("Phone number is required", toastOptions);
            return false;
        }

        if (phoneNumber.length < 10) {
            toast.error("Phone number must be at least 10 digits", toastOptions);
            return false;
        }

        if (!city.trim()) {
            toast.error("City is required", toastOptions);
            return false;
        }

        if (!state.trim()) {
            toast.error("State is required", toastOptions);
            return false;
        }

        if (!password.trim()) {
            toast.error("Password is required", toastOptions);
            return false;
        }

        const { length, lowercase, uppercase, number, specialChar } = passwordChecks;
        if (!length || !lowercase || !uppercase || !number || !specialChar) {
            toast.error("Password does not meet all conditions", toastOptions);
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!handleValidation()) return;

        axios.post(signupRoute, values, {
            headers: {
                "api-key": secretKey
            }
        })
            .then((res) => {
                if (res.data.status === true) {
                    window.alert(`Affiliate created successfully! URL: ${res.data.url}`);
                    toast.success(res.data.msg, toastOptions);
                    setValues({
                        role: roleCases.SET_AFFILIATOR,
                        username: "",
                        email: "",
                        phoneNumber: "",
                        city: "",
                        state: "",
                        password: ""
                    });
                    setPasswordChecks({
                        length: false,
                        lowercase: false,
                        uppercase: false,
                        number: false,
                        specialChar: false,
                    });
                } else {
                    toast.error(res.data.msg, toastOptions);
                }
            });
    };

    return (
        <div className="add-affiliate-container">
            <h2 className="form-title">Add New Affiliate</h2>
            <form className="add-affiliate-form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="input-label">Username</label>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Enter username"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Email</label>
                    <input
                        className="form-input"
                        type="email"
                        placeholder="Enter email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Phone Number</label>
                    <input
                        className="form-input"
                        type="number"
                        placeholder="Enter phone number"
                        name="phoneNumber"
                        value={values.phoneNumber}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">City</label>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Enter city"
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">State</label>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Enter state"
                        name="state"
                        value={values.state}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Password</label>
                    <input
                        className="form-input"
                        type="password"
                        placeholder="Enter password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                    />
                    {values.password && (
                        <div className="password-checklist">
                            <p>Password must contain:</p>
                            <ul>
                                <li className={passwordChecks.length ? "valid" : "invalid"}>
                                    {passwordChecks.length ? "✅" : "❌"} At least 8 characters
                                </li>
                                <li className={passwordChecks.lowercase ? "valid" : "invalid"}>
                                    {passwordChecks.lowercase ? "✅" : "❌"} Lowercase letter (a-z)
                                </li>
                                <li className={passwordChecks.uppercase ? "valid" : "invalid"}>
                                    {passwordChecks.uppercase ? "✅" : "❌"} Uppercase letter (A-Z)
                                </li>
                                <li className={passwordChecks.number ? "valid" : "invalid"}>
                                    {passwordChecks.number ? "✅" : "❌"} Number (0-9)
                                </li>
                                <li className={passwordChecks.specialChar ? "valid" : "invalid"}>
                                    {passwordChecks.specialChar ? "✅" : "❌"} Special character (@$!%*?#&)
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <button className="submit-button" type="submit">Add Affiliate</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default AddAffile;
