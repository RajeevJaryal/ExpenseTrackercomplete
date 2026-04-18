import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../store/AuthReducer";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

export default function CompleteProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nameRef = useRef();
  const imageRef = useRef();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const idToken = localStorage.getItem("token");

      if (!idToken) {
        setError("No session found. Please log in again.");
        return setFetching(false);
      }

      if (isTokenExpired(idToken)) {
        setError("Session expired. Please log in again.");
        return setFetching(false);
      }

      try {
        const res = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message);

        const user = data.users[0];

        if (user.displayName && nameRef.current) {
          nameRef.current.value = user.displayName;
        }

        if (user.photoURL && imageRef.current) {
          imageRef.current.value = user.photoURL;
          setPreview(user.photoURL);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const idToken = localStorage.getItem("token");

    if (!idToken) {
      setError("No session found. Please log in again.");
      setLoading(false);
      return;
    }

    if (isTokenExpired(idToken)) {
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken,
            displayName: nameRef.current.value,
            photoUrl: imageRef.current.value || "",
            returnSecureToken: true,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message);

      if (data.idToken) {
        localStorage.setItem("token", data.idToken);
      }

      // Push updated profile into Redux + localStorage
      dispatch(
        updateProfile({
          displayName: data.displayName || nameRef.current.value,
          photoUrl: data.photoUrl || imageRef.current.value || "",
        })
      );

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/header");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gray-900 text-white overflow-hidden">

      {/* Background blobs */}
      <div className="absolute w-80 h-80 bg-purple-500/30 blur-3xl rounded-full -top-16 -right-12"></div>
      <div className="absolute w-64 h-64 bg-cyan-500/30 blur-3xl rounded-full bottom-10 -left-16"></div>

      <div className="w-full max-w-md z-10">

        {/* Back */}
        <button
          onClick={() => navigate("/header")}
          className="flex items-center gap-2 text-sm text-gray-400 mb-6 hover:text-white transition"
        >
          ← Back to dashboard
        </button>

        <div className="bg-gray-800/80 backdrop-blur border border-gray-700 rounded-2xl p-8 shadow-xl">

          {/* Header */}
          <div className="flex flex-col items-center mb-7">

            {/* Avatar preview */}
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full border border-purple-500/40 overflow-hidden flex items-center justify-center bg-gray-700">
                {preview ? (
                  <img
                    src={preview}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={() => setPreview("")}
                  />
                ) : (
                  <span className="text-3xl text-purple-400">👤</span>
                )}
              </div>

              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs">
                ✏️
              </div>
            </div>

            <h1 className="text-2xl font-extrabold">Complete Profile</h1>

            <p className="text-sm text-gray-400 mt-1 text-center">
              Update your display name and photo
            </p>
          </div>

          {fetching ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-5">

              {/* Name */}
              <input
                ref={nameRef}
                type="text"
                placeholder="Full Name"
                required
                className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* Image URL */}
              <input
                ref={imageRef}
                type="url"
                placeholder="Profile Image URL (optional)"
                onChange={(e) => setPreview(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-700 border border-gray-600 outline-none focus:ring-2 focus:ring-purple-500"
              />

              <p className="text-xs text-gray-500">
                Paste an image URL to preview above
              </p>

              {error && (
                <p className="text-xs bg-red-500/10 text-red-400 px-3 py-2 rounded-lg border border-red-500/20">
                  {error}
                </p>
              )}

              {success && (
                <p className="text-xs bg-green-500/10 text-green-400 px-3 py-2 rounded-lg border border-green-500/20">
                  ✓ Profile updated! Redirecting...
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/header")}
                  className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-300 hover:border-gray-400 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold disabled:opacity-60 hover:opacity-90 transition"
                >
                  {loading ? "Updating..." : "Update Profile →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}