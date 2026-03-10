import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/ForgotPassword.css";
import API_BASE_URL from '../config';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
            console.log('response: ',response)
            alert(response.data.message);
        } catch (error) {
          console.log('ERROR: ',error)
            alert(error.response?.data?.message || "Error occurred");
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <h2 className="forgot-password-title">Forgot Password</h2>
                <p className="forgot-password-text">Enter your email to reset your password.</p>
                <input
                    type="email"
                    placeholder="Email"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button className="reset-button" onClick={handleForgotPassword}>Request Reset Link</button>
                <p className="message">{message}</p>
                <p className="back-to-login" onClick={() => navigate("/login")}>Back to Login</p>
            </div>
        </div>
    );
};

export default ForgotPassword;
