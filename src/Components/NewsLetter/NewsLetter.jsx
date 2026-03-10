import React, { useState } from 'react';
import './NewsLetter.css'
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import API_BASE_URL from '../../config';

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  
    if (emailRegex.test(email)) {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/subscribe`, { email });
        navigate('/confirmation', { state: { email } });
      } catch (err) {
        console.error("Failed to subscribe:", err);
        alert("Subscription failed. Please try again later.");
      }
    } else {
      alert("Please enter a valid email address");
    }
  };

  return (
    <div className='newsletter'>
        <h1>Get Exclusive Offers on Your Email</h1>
        <p>Subscribe to our newsletter and stay updated</p>
        <div>
            <input 
            type="email" 
            placeholder='Your Email ID'
            value = {email}
            onChange={(e) => setEmail(e.target.value)}
             />
            <button onClick={handleSubscribe}>Subscribe</button>
        </div>
    </div>
  )
}

export default NewsLetter
