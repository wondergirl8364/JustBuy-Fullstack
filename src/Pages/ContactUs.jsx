import React, { useState } from "react";
import "../Styles/ContactUs.css";
import API_BASE_URL from '../config';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnquiry = async () => {
    const { name, email, phone, message } = formData;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send enquiry.");
    }
  };

  return (
    <div className="contact-us-container">
      <div className="contact-us-box">
        <h2 className="contact-us-title">Contact Us</h2>
        <p className="contact-us-text">You will get a response within 24 hours</p>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="input-field"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input-field"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          className="input-field"
          value={formData.phone}
          onChange={handleChange}
        />
        <textarea
          name="message"
          placeholder="Message"
          className="input-field"
          rows="4"
          value={formData.message}
          onChange={handleChange}
        />

        <button className="contact-button" onClick={handleEnquiry}>
          Send Enquiry
        </button>
      </div>

      <div className="map-container">
        <h3 className="contact-us-title">Our Location</h3>
        <iframe
          title="company-location"
          className="map-frame"
          src="https://www.google.com/maps?q=Best+Buy+Headquarters,+Richfield,+MN&output=embed"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;
