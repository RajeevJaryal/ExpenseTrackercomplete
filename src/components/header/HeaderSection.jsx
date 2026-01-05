import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

const HeaderSection = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const emailVerified = localStorage.getItem("emailVerified") === "true";

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
            idToken: idToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      alert("Verification email sent! Check your inbox 📩");
    } catch (error) {
      // 🔴 Handle Firebase errors
      if (error.message === "INVALID_ID_TOKEN") {
        alert("Session expired. Please login again.");
      } else if (error.message === "USER_NOT_FOUND") {
        alert("User not found.");
      } else {
        alert(error.message);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <h2>Welcome to Expense Tracker</h2>

      {!emailVerified && (
        <div className="warning">
          <p>Your email is not verified.</p>
          <button onClick={verifyEmailHandler} disabled={loading}>
            {loading ? "Sending..." : "Verify Email"}
          </button>
        </div>
      )}

      <button onClick={() => navigate("/complete-profile")}>
        Complete Profile
      </button>
    </>
  );
};

export default HeaderSection;
