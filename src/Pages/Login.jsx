// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import "../Styles/Login.css";
// import { AuthContext } from "../Context/AuthContext";

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext); // 🔁 From AuthContext

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async () => {
//     try {
//       const response = await fetch("wdm-backend.onrender.com/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         login(data.token); // 🔐 Set token globally through context

//         alert("Login Successful");
//         navigate("/"); // Redirect as needed
//       } else {
//         alert(data.message || "Login failed");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       alert("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2 className="login-title">Login</h2>

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           className="input-field"
//           onChange={handleChange}
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           className="input-field"
//           onChange={handleChange}
//         />

//         <span
//           className="forgot-password"
//           onClick={() => navigate("/forgot-password")}
//         >
//           Forgot Password?
//         </span>

//         <button className="login-button" onClick={handleLogin}>
//           Login
//         </button>

//         <p className="signup-text">
//           Don't have an account?{" "}
//           <span className="signup-link" onClick={() => navigate("/signup")}>
//             Sign Up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";
import { AuthContext } from "../Context/AuthContext";
import API_BASE_URL from '../config';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token in context and localStorage
        login(data.token);
        localStorage.setItem("userToken", data.token);

        alert("Login Successful");

        // Redirect based on role
        if (data.role === "Admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input-field"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-field"
          value={formData.password}
          onChange={handleChange}
        />

        <span
          className="forgot-password"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </span>

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

        <p className="signup-text">
          Don't have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
