import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signUpUser } from "../../store/AuthReducer";

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, token } = useSelector((s) => s.auth);

  const loginEmailRef = useRef();
  const loginPassRef = useRef();
  const signupEmailRef = useRef();
  const signupPassRef = useRef();
  const confirmPassRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [localErr, setLocalErr] = useState("");

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    if (token) navigate("/header");
  }, [token, navigate]);

  const submit = (e) => {
    e.preventDefault();
    setLocalErr("");

    if (isLogin) {
      dispatch(
        loginUser({
          email: loginEmailRef.current.value.trim(),
          password: loginPassRef.current.value.trim(),
        })
      )
        .unwrap()
        .then(() => navigate("/header"))
        .catch((err) =>
          setLocalErr(err?.message || "Login failed. Try again.")
        );
    } else {
      const email = signupEmailRef.current.value.trim();
      const pass = signupPassRef.current.value.trim();
      const confirm = confirmPassRef.current.value.trim();

      if (pass !== confirm)
        return setLocalErr("Passwords don't match");

      if (pass.length < 6)
        return setLocalErr("Password must be at least 6 characters");

      dispatch(signUpUser({ email, password: pass }))
        .unwrap()
        .then(() => {
          setLocalErr("");
          setIsLogin(true);
        })
        .catch((err) =>
          setLocalErr(err?.message || "Signup failed. Try again.")
        );
    }
  };

  const errMsg = localErr || error;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gray-900 text-white overflow-hidden">

      {/* Background blobs */}
      <div className="absolute w-96 h-96 bg-purple-500/30 blur-3xl rounded-full -top-20 -left-24"></div>
      <div className="absolute w-72 h-72 bg-pink-500/30 blur-3xl rounded-full bottom-0 -right-16"></div>
      <div className="absolute w-48 h-48 bg-cyan-500/20 blur-3xl rounded-full bottom-28 left-8"></div>

      <div className="w-full max-w-md perspective-[1200px] z-10">
        <div
          className="relative min-h-[520px] transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: isLogin ? "rotateY(0deg)" : "rotateY(180deg)",
          }}
        >

          {/* LOGIN */}
          <div className="absolute inset-0 bg-gray-800/80 backdrop-blur border border-gray-700 rounded-2xl p-8 flex flex-col"
               style={{ backfaceVisibility: "hidden" }}>

            <div className="flex flex-col items-center mb-7">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
                💰
              </div>
              <h1 className="text-2xl font-extrabold">Welcome back</h1>
              <p className="text-sm text-gray-400 mt-1">
                Sign in to Expense Tracker
              </p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-4">

              <input
                ref={loginEmailRef}
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
                disabled={loading}
                className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 outline-none focus:ring-2 focus:ring-purple-500"
              />

              <div className="relative">
                <input
                  ref={loginPassRef}
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                  className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                />

                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  👁
                </button>
              </div>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-xs text-purple-400 text-right"
              >
                Forgot password?
              </button>

              {errMsg && (
                <p className="text-xs bg-red-500/10 text-red-400 px-3 py-2 rounded-lg border border-red-500/20">
                  {errMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in →"}
              </button>
            </form>

            <p className="text-center text-sm mt-5 text-gray-400">
              New here?{" "}
              <button
                onClick={() => setIsLogin(false)}
                disabled={loading}
                className="text-purple-400 font-semibold"
              >
                Create account
              </button>
            </p>
          </div>

          {/* SIGNUP */}
          <div
            className="absolute inset-0 bg-gray-800/80 backdrop-blur border border-gray-700 rounded-2xl p-8 flex flex-col"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >

            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 flex items-center justify-center mb-4 shadow-lg">
                👤
              </div>
              <h1 className="text-2xl font-extrabold">Create Account</h1>
              <p className="text-sm text-gray-400 mt-1">
                Join for free
              </p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-4">

              <input
                ref={signupEmailRef}
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
                disabled={loading}
                className="p-3 rounded-xl bg-gray-700 border border-gray-600"
              />

              <input
                ref={signupPassRef}
                type="password"
                placeholder="Password"
                required
                disabled={loading}
                className="p-3 rounded-xl bg-gray-700 border border-gray-600"
              />

              <input
                ref={confirmPassRef}
                type="password"
                placeholder="Confirm Password"
                required
                disabled={loading}
                className="p-3 rounded-xl bg-gray-700 border border-gray-600"
              />

              {errMsg && (
                <p className="text-xs bg-red-500/10 text-red-400 px-3 py-2 rounded-lg border border-red-500/20">
                  {errMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 font-semibold disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Account →"}
              </button>
            </form>

            <p className="text-center text-sm mt-5 text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                disabled={loading}
                className="text-purple-400 font-semibold"
              >
                Sign in
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}