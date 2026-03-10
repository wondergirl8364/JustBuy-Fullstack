import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/AccountSettings.css";
import API_BASE_URL from '../config';

const AccountSettings = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    notifications: {
      email: true,
      sms: false,
    },
  });

  // Get token from localStorage
  const token = localStorage.getItem("token");

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/account-settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData((prev) => ({
          ...prev,
          fullName: res.data.fullName,
          email: res.data.email,
          phone: res.data.phone,
          notifications: res.data.notifications,
        }));
      } catch (err) {
        console.error("Error fetching account settings", err);
        alert("Could not load account settings.");
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setUserData((prev) => ({
        ...prev,
        notifications: { ...prev.notifications, [name]: checked },
      }));
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Phone validation (e.g., 10 digits, only numbers)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(userData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/account-settings`,
        {
          fullName: userData.fullName,
          phone: userData.phone,
          password: userData.password,
          newPassword: userData.newPassword,
          confirmPassword: userData.confirmPassword,
          notifications: userData.notifications,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Profile updated successfully!");
      console.log("Response:", res.data);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="user-settings-container">
      <h2 className="heading">Manage Account Settings</h2>

      <form className="form" onSubmit={handleSubmit}>
        <h3 className="miniHeading">Profile Details</h3>
        <label className="label">Full Name</label>
        <input
          className="input"
          type="text"
          name="fullName"
          value={userData.fullName}
          onChange={handleChange}
          required
        />

        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          name="email"
          value={userData.email}
          disabled // Email can't be updated
        />

        <label className="label">Phone Number</label>
        <input
          className="input"
          type="text"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
          required
        />

        <h3 className="miniHeading">Change Password</h3>
        <label className="label">Current Password</label>
        <input
          className="input"
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
        />

        <label className="label">New Password</label>
        <input
          className="input"
          type="password"
          name="newPassword"
          value={userData.newPassword}
          onChange={handleChange}
        />

        <label className="label">Confirm New Password</label>
        <input
          className="input"
          type="password"
          name="confirmPassword"
          value={userData.confirmPassword}
          onChange={handleChange}
        />

        <h3 className="miniHeading">Notification Preferences</h3>
        <label className="label">
          <input
            className="input"
            type="checkbox"
            name="email"
            checked={userData.notifications.email}
            onChange={handleChange}
          />
          Receive notifications via Email
        </label>

        <label className="label">
          <input
            className="input"
            type="checkbox"
            name="sms"
            checked={userData.notifications.sms}
            onChange={handleChange}
          />
          Receive notifications via SMS
        </label>

        <button className="saveButton" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
