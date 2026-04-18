import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

const generateUserId = (email) => email.replace(/[@.]/g, "");

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }) => {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error.message);
    return data;
  }
);

// SIGN UP
export const signUpUser = createAsyncThunk(
  "auth/signUpUser",
  async ({ email, password }) => {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error.message);
    return data;
  }
);

const initialState = {
  token: localStorage.getItem("token") || null,
  email: localStorage.getItem("email") || null,
  userId: localStorage.getItem("userId") || null,
  isVerified: JSON.parse(localStorage.getItem("emailVerified")) || false,
  displayName: localStorage.getItem("displayName") || null,
  photoUrl: localStorage.getItem("photoUrl") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout(state) {
      state.token = null;
      state.email = null;
      state.userId = null;
      state.isVerified = false;
      state.displayName = null;
      state.photoUrl = null;

      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      localStorage.removeItem("emailVerified");
      localStorage.removeItem("displayName");
      localStorage.removeItem("photoUrl");
    },

    updateProfile(state, action) {
      state.displayName = action.payload.displayName || null;
      state.photoUrl = action.payload.photoUrl || null;
      localStorage.setItem("displayName", action.payload.displayName || "");
      localStorage.setItem("photoUrl", action.payload.photoUrl || "");
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const email = action.payload.email;
        const userId = generateUserId(email);

        state.token = action.payload.idToken;
        state.email = email;
        state.userId = userId;
        state.isVerified = action.payload.emailVerified;
        state.displayName = action.payload.displayName || null;
        state.photoUrl = action.payload.photoUrl || null;

        localStorage.setItem("token", action.payload.idToken);
        localStorage.setItem("email", email);
        localStorage.setItem("userId", userId);
        localStorage.setItem(
          "emailVerified",
          JSON.stringify(action.payload.emailVerified || false)
        );
        localStorage.setItem("displayName", action.payload.displayName || "");
        localStorage.setItem("photoUrl", action.payload.photoUrl || "");
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // SIGNUP
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signUpUser.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;