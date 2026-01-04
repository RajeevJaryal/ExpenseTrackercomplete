
import React, { useRef, useState } from "react";

const FIREBASE_API_KEY = "AIzaSyD_l7c84umFPHaOHg0RAHwrIG8Dphwuo_8";

const LoginForm = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prev) => !prev);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    if (!isLogin) {
      const confirmPassword = confirmPasswordRef.current.value;
      if (enteredPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
    }

    setIsLoading(true);

    const url = isLogin
      ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`
      : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || "Authentication failed!");
      }

      console.log("AUTH SUCCESS:", data);
      alert(isLogin ? "Login successful!" : "Account created successfully!");
    } catch (error) {
      alert(error.message);
    }

    setIsLoading(false);
  };

  return (
    <section>
      <form onSubmit={formSubmitHandler}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        <label>Email</label>
        <input type="email" ref={emailRef} required />

        <label>Password</label>
        <input type="password" ref={passwordRef} required />

        {!isLogin && (
          <>
            <label>Confirm Password</label>
            <input type="password" ref={confirmPasswordRef} required />
          </>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : isLogin ? "Login" : "Create Account"}
        </button>

        <button type="button" onClick={switchAuthModeHandler}>
          {isLogin
            ? "Create new account"
            : "Already have an account? Login"}
        </button>
      </form>
    </section>
  );
};

export default LoginForm;
