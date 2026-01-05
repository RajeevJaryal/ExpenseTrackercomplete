import React, { useRef, useState } from "react";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

const LoginForm = () => {
  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();

  const signupEmailRef = useRef();
  const signupPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchModeHandler = () => {
    setIsLogin((prev) => !prev);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let email, password;

    if (isLogin) {
      email = loginEmailRef.current.value;
      password = loginPasswordRef.current.value;
    } else {
      email = signupEmailRef.current.value;
      password = signupPasswordRef.current.value;
      const confirmPassword = confirmPasswordRef.current.value;

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        setIsLoading(false);
        return;
      }
    }

    const url = isLogin
      ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
      : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || "Authentication failed!");
      }

      
      localStorage.setItem("token", data.idToken);
      localStorage.setItem("email", data.email);
      localStorage.setItem("emailVerified", data.emailVerified);

      if (isLogin) {
        alert("Login successful!");
        navigate("/header"); 
      } else {
        alert("Account created successfully!");
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="scene">
      <div className={`card ${!isLogin ? "flip" : ""}`}>

        <div className="card-face card-front">
          <h2>Login</h2>

          <form onSubmit={submitHandler}>
            <div className="field">
              <input type="email" ref={loginEmailRef} required />
              <label>Email</label>
            </div>

            <div className="field">
              <input type="password" ref={loginPasswordRef} required />
              <label>Password</label>
            </div>

            <button disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="switch">
            New user?
            <span onClick={switchModeHandler}> Create account</span>
          </p>
        </div>

        <div className="card-face card-back">
          <h2>Create Account</h2>

          <form onSubmit={submitHandler}>
            <div className="field">
              <input type="email" ref={signupEmailRef} required />
              <label>Email</label>
            </div>

            <div className="field">
              <input type="password" ref={signupPasswordRef} required />
              <label>Password</label>
            </div>

            <div className="field">
              <input type="password" ref={confirmPasswordRef} required />
              <label>Confirm Password</label>
            </div>

            <button disabled={isLoading}>
              {isLoading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="switch">
            Already have an account?
            <span onClick={switchModeHandler}> Login</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginForm;
