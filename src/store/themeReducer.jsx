import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: { darkMode: false, premium: false },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
    activatePremium: (state) => {
      state.darkMode = true;
      state.premium = true;
    },
  },
});

export const { toggleTheme, activatePremium } = themeSlice.actions;
export default themeSlice.reducer;
