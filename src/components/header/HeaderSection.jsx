import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeaderSection.css";

const HeaderSection = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <h2>Welcome to ExpenseTracker</h2>

      <div className="warning-card">
        <p>Your profile is incomplete.</p>
        <button onClick={() => navigate("/complete-profile")}>
          Complete Profile
        </button>
      </div>
    </header>
  );
};

export default HeaderSection;
