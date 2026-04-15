import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",

  initialState: {
    darkMode: false,
    premium: false,
  },

  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },

    activatePremium: (state) => {
      state.premium = true;
      state.darkMode = true;
    },

    disablePremium: (state) => {
      state.premium = false;
      state.darkMode = false;
    },
  },
});

export const {
  toggleTheme,
  activatePremium,
  disablePremium,
} = themeSlice.actions;

export default themeSlice.reducer;