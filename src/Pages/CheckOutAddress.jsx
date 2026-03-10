import React, { useState, useEffect } from "react";
import "../Styles/CheckOutAddress.css";
import CheckOutItems from "../Components/CheckOutItems/CheckOutItems";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API_BASE_URL from '../config';

const CheckOutAddress = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    Address_Line1: "",
    Address_Line2: "",
    City: "",
    Country: "",
    State: "",
    Zipcode: "",
    Optional_Notes: "",
    Save_Info: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId || decoded.id || decoded.sub);
        setIsLoggedIn(true);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      User_ID: userId,
      ...formData,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/shipping`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        navigate("/checkout-shipping");
      } else {
        const error = await res.json();
        alert(`Error: ${error.message || "Failed to save address"}`);
      }
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="checkout-container">
      {/* Left Side - Shipping Information */}
      <div className="checkout-left">
        <h2 className="checkout-title">Checkout</h2>
        <div className="checkout-steps">
          <span className="active-step">Address</span> ——{" "}
          <span>Shipping</span> —— <span>Payment</span>
        </div>

        <h3 className="section-title">Shipping Information</h3>
        <form className="shipping-form" onSubmit={handleSubmit}>
          <div className="input-row">
            <input
              type="text"
              placeholder="First Name"
              name="First_Name"
              value={formData.First_Name}
              onChange={handleChange}
              className="input-field"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              name="Last_Name"
              value={formData.Last_Name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <input
            type="text"
            placeholder="Address"
            name="Address_Line1"
            value={formData.Address_Line1}
            onChange={handleChange}
            className="input-field full-width"
            required
          />

          <input
            type="text"
            placeholder="Apartment, suite, etc (optional)"
            name="Address_Line2"
            value={formData.Address_Line2}
            onChange={handleChange}
            className="input-field full-width"
          />

          <input
            type="text"
            placeholder="City"
            name="City"
            value={formData.City}
            onChange={handleChange}
            className="input-field full-width"
            required
          />

          <div className="input-row">
            <select
              name="Country"
              value={formData.Country}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Country</option>
              <option value="USA">USA</option>
              <option value="India">India</option>
              <option value="UK">UK</option>
            </select>

            <select
              name="State"
              value={formData.State}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">State</option>
              <option value="Texas">Texas</option>
              <option value="California">California</option>
              <option value="New York">New York</option>
            </select>

            <input
              type="text"
              placeholder="Zipcode"
              name="Zipcode"
              value={formData.Zipcode}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <input
            type="text"
            placeholder="Optional Notes"
            name="Optional_Notes"
            value={formData.Optional_Notes}
            onChange={handleChange}
            className="input-field full-width"
          />

          <div className="save-contact">
            <input
              type="checkbox"
              id="save-info"
              name="Save_Info"
              checked={formData.Save_Info}
              onChange={handleChange}
            />
            &nbsp;
            <label htmlFor="save-info">Save contact information</label>
          </div>

          <button className="continue-button" type="submit">
            Continue to shipping
          </button>
        </form>
      </div>

      {/* Right Side - Cart Summary */}
      <div className="checkout-right">
        <h3 className="cart-title">Review Cart</h3>
        <div>
          <CheckOutItems />
        </div>
      </div>
    </div>
  );
};

export default CheckOutAddress;
