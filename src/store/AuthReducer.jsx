import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

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

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    email: null,
    isVerified: false,
    loading: false,
    error: null,
  },

  reducers: {
    logout(state) {
      state.token = null;
      state.email = null;
      state.isVerified = false;
      localStorage.clear();
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.idToken;
        state.email = action.payload.email;
        state.isVerified = action.payload.emailVerified;

        localStorage.setItem("token", action.payload.idToken);
        localStorage.setItem("email", action.payload.email);
        localStorage.setItem(
          "emailVerified",
          action.payload.emailVerified || false
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // SIGNUP
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
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

export const { logout } = authSlice.actions;
export default authSlice.reducer;
