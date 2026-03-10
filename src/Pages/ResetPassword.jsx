import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/ResetPassword.css";
import API_BASE_URL from '../config';

const ResetPassword = () => {
    const { resetToken } = useParams();  // Extract the token from the URL
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true); // To show loading until token verification is complete

    // Validate token on component mount
    useEffect(() => {
        const verifyToken = async () => {
            try {
                // Call the backend to verify the token
                await axios.get(`${API_BASE_URL}/api/auth/verify-reset-token/${resetToken}`);
                setLoading(false); // Token is valid, proceed to allow password reset
            } catch (error) {
                setLoading(false);
                setMessage("The reset link is expired or invalid.");
            }
        };

        verifyToken();
    }, [resetToken]);

    // Handle password reset
    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, { resetToken, password });
            console.log('RESPONSE:',response)
            alert(response.data.message);
            setTimeout(() => navigate("/login"), 2000); // Redirect to login after successful reset
        } catch (error) {
            setMessage(error.response?.data?.message || "Error resetting password");
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-box">
                <h2 className="reset-password-title">Reset Password</h2>
                {loading ? (
                    <p>Verifying your link...</p> // Show loading message
                ) : (
                    <>
                        <p className="reset-password-text">Enter a new password.</p>
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="input-field"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button className="reset-button" onClick={handleResetPassword}>Reset Password</button>
                    </>
                )}
                <p className="message" style={{color:"red"}}>{message}</p>
            </div>
        </div>
    );
};

export default ResetPassword;
