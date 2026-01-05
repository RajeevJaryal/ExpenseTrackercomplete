import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeaderSection.css";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

const HeaderSection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const emailVerified = localStorage.getItem("emailVerified") === "true";
  const logoutHandler = () => {
    localStorage.clear();
    navigate("/");
  };

  const verifyEmailHandler = async () => {
    setLoading(true);
    const idToken = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      alert("Verification email sent! 📩 Check your inbox.");
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <header className="header">
      
      <div className="header-top">
        <h2 className="logo">Expense Tracker</h2>

        <button className="logout-btn" onClick={logoutHandler}>
          Logout
        </button>
      </div>

     
      {!emailVerified && (
        <div className="warning">
          <p>Your email is not verified.</p>
          <button onClick={verifyEmailHandler}>Verify Email</button>
        </div>
      )}

      <button
        className="primary-btn"
        onClick={() => navigate("/complete-profile")}
      >
        Complete Profile
      </button>
    </header>
  );
};

export default HeaderSection;
