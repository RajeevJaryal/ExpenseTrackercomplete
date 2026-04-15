import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestType: "PASSWORD_RESET", email }),
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error?.message || "Something went wrong");
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gray-900 text-white overflow-hidden">

      {/* Background blobs */}
      <div className="absolute w-72 h-72 bg-pink-500/30 rounded-full blur-3xl -top-16 -right-16"></div>
      <div className="absolute w-56 h-56 bg-purple-500/30 rounded-full blur-3xl bottom-10 -left-12"></div>

      <div className="w-full max-w-sm z-10">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-gray-400 mb-6 hover:text-white transition"
        >
          ← Back to sign in
        </button>

        <div className="bg-gray-800/80 backdrop-blur p-8 rounded-2xl shadow-xl border border-gray-700">

          {!sent ? (
            <>
              {/* Header */}
              <div className="flex flex-col items-center mb-7">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-r from-pink-500 to-orange-400 shadow-lg">
                  ✉️
                </div>

                <h1 className="text-2xl font-extrabold">
                  Reset Password
                </h1>

                <p className="text-sm text-gray-400 text-center mt-1">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {/* Form */}
              <form onSubmit={submit} className="flex flex-col gap-4">

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">
                    Email address
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>

                {error && (
                  <p className="text-xs px-3 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-orange-400 hover:opacity-90 transition disabled:opacity-60 flex justify-center items-center gap-2"
                >
                  {loading ? "Sending..." : "Send Reset Link →"}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-green-500/20 border border-green-500/40">
                ✅
              </div>

              <h2 className="text-xl font-extrabold mb-2">
                Check your inbox!
              </h2>

              <p className="text-sm text-gray-400">
                Reset link sent to
              </p>

              <p className="font-semibold text-sm mb-6 text-purple-400">
                {email}
              </p>

              <p className="text-xs text-gray-500 mb-6">
                Didn’t receive it? Check spam or try again.
              </p>

              <button
                onClick={() => setSent(false)}
                className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Try another email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}