import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Signup.css";
import API_BASE_URL from '../config';

export const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token); // Store token for future API calls
        alert('Sign Up Successful')
        navigate("/"); // Redirect to dashboard
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">Sign Up</h2>

        <input type="text" name="firstName" placeholder="First Name" className="input-field" onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" className="input-field" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" className="input-field" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" className="input-field" onChange={handleChange} />

        <button className="signup-button" onClick={handleSignup}>Sign Up</button>

        <p className="login-text">
          Already have an account? <span className="login-link" onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
