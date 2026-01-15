import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/AuthReducer";
import { selectTotalAmount } from "../../store/expensesSlice";
import "./HeaderSection.css";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

const HeaderSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const { token, emailVerified } = useSelector((state) => state.auth);
  const totalAmount = useSelector(selectTotalAmount);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  const verifyEmailHandler = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: token,
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

        <div className="header-actions">
          <button className="logout-btn" onClick={logoutHandler}>
            Logout
          </button>
        </div>
      </div>

      {!emailVerified && (
        <div className="warning">
          <p>Your email is not verified.</p>
          <button disabled={loading} onClick={verifyEmailHandler}>
            {loading ? "Sending..." : "Verify Email"}
          </button>
        </div>
      )}

      <div className="header-bottom">
        <button
          className="primary-btn"
          onClick={() => navigate("/complete-profile")}
        >
          Complete Profile
        </button>

        <button
          className="secondary-btn"
          onClick={() => navigate("/expense-form")}
        >
          Enter Expense
        </button>
      </div>

      {/* ⭐ PREMIUM BUTTON */}
      {totalAmount > 10000 && (
        <button
          className="premium-btn"
          onClick={() => alert("Premium Activated! 🎉")}
        >
          Activate Premium ⭐
        </button>
      )}
    </header>
  );
};

export default HeaderSection;
