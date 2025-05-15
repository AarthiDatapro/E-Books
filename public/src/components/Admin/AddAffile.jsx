import React, { useState } from 'react';
import { roleCases } from '../../utils/constants';
import axios from 'axios';
import { signupRoute } from '../../utils/APIRoutes';
import { toast, ToastContainer } from 'react-toastify';
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

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
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

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long", toastOptions);
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!handleValidation()) return;
        setValues({
            role: roleCases.SET_AFFILIATOR,
            username: "",
            email: "",
            phoneNumber: "",
            city: "",
            state: "",
            password: ""
        });
        console.log("Form Submitted:", values);
        axios.post(signupRoute, values)
            .then((res) => {
                if (res.data.status === true) {
                    window.alert(`Affiliate created successfully! URL: ${res.data.url}`);
                    toast.success(res.data.msg, toastOptions)
                }
                else {
                    toast.error(res.data.msg, toastOptions)
                }
            })
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
                </div>
                
                <button className="submit-button" type="submit">Add Affiliate</button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default AddAffile;
