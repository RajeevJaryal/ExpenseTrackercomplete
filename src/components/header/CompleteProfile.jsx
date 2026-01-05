import React, { useRef, useState, useEffect } from "react";
import "./CompleteProfile.css";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

const CompleteProfile = () => {
  const nameRef = useRef();
  const imageUrlRef = useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const idToken = localStorage.getItem("token");
      if (!idToken){
        console.error("No idToken found!");
        return;
      } 

      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error.message);
        }

        const user = data.users[0];

       
        if (user.displayName) {
          nameRef.current.value = user.displayName;
        }

        if (user.photoUrl) {
          imageUrlRef.current.value = user.photoUrl;
        }
      } catch (error) {
        alert(error.message);
      }
    };

    fetchProfile();
  }, []);

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const idToken = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken,
            displayName: nameRef.current.value,
            photoUrl: imageUrlRef.current.value,
            returnSecureToken: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      alert("Profile updated successfully");
    } catch (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="profile-scene">
      <form className="profile-card" onSubmit={updateProfileHandler}>
        <h2>Complete Your Profile</h2>

        <div className="profile-field">
          <input type="text" ref={nameRef} required placeholder=" " />
          <label>Full Name</label>
        </div>

        <div className="profile-field">
          <input type="url" ref={imageUrlRef} required placeholder=" " />
          <label>Profile Photo URL</label>
        </div>

        <button disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile;
