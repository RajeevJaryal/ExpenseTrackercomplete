import React, { useRef, useState } from "react";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signUpUser } from "../../store/AuthReducer";

const LoginForm = () => {
  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();

  const signupEmailRef = useRef();
  const signupPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLogin, setIsLogin] = useState(true);

  // ⬇ Redux state
  const { loading, error, token } = useSelector((state) => state.auth);

  const switchModeHandler = () => {
    setIsLogin((prev) => !prev);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    let email, password;

    if (isLogin) {
      email = loginEmailRef.current.value;
      password = loginPasswordRef.current.value;
      dispatch(loginUser({ email, password }))
        .unwrap()
        .then(() => navigate("/header"))
        .catch((err) => alert(err));
    } else {
      email = signupEmailRef.current.value;
      password = signupPasswordRef.current.value;
      const confirmPassword = confirmPasswordRef.current.value;

      if (password !== confirmPassword) return alert("Passwords don't match");

      dispatch(signUpUser({ email, password }))
        .unwrap()
        .then(() => {
          alert("Account created! Please login.");
          setIsLogin(true);
        })
        .catch((err) => alert(err));
    }
  };

  return (
    <div className="scene">
      <div className={`card ${!isLogin ? "flip" : ""}`}>
        {/* LOGIN SIDE */}
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

            <button disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
          <p className="forgot-password">
            <span onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </span>
          </p>
          <p className="switch">
            New user?
            <span onClick={switchModeHandler}> Create account</span>
          </p>
        </div>

        {/* SIGN UP SIDE */}
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

            <button disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}

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
