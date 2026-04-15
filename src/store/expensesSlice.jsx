import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import firebaseAPI from "../api/firebase";

/* ================= FETCH ================= */
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (_, { getState }) => {
    const { userId, token } = getState().auth;

    if (!userId || !token) return [];

    const res = await firebaseAPI.get(
      `/expenses/${userId}.json?auth=${token}`
    );

    const data = res.data;
    if (!data) return [];

    return Object.keys(data)
      .map((key) => ({ id: key, ...data[key] }))
      .reverse();
  }
);

/* ================= ADD ================= */
export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (expense, { getState }) => {
    const { userId, token } = getState().auth;

    if (!userId || !token) {
      console.log("❌ USER OR TOKEN MISSING");
      return;
    }

    const res = await firebaseAPI.post(
      `/expenses/${userId}.json?auth=${token}`,
      expense
    );

    return { id: res.data.name, ...expense };
  }
);

/* ================= DELETE ================= */
export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id, { getState }) => {
    const { userId, token } = getState().auth;

    if (!userId || !token) return;

    await firebaseAPI.delete(
      `/expenses/${userId}/${id}.json?auth=${token}`
    );

    return id;
  }
);

/* ================= EDIT ================= */
export const editExpense = createAsyncThunk(
  "expenses/editExpense",
  async ({ id, updatedExpense }, { getState }) => {
    const { userId, token } = getState().auth;

    if (!userId || !token) return;

    await firebaseAPI.put(
      `/expenses/${userId}/${id}.json?auth=${token}`,
      updatedExpense
    );

    return { id, ...updatedExpense };
  }
);

/* ================= SLICE ================= */
const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    expenseData: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseData = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      /* ADD */
      .addCase(addExpense.fulfilled, (state, action) => {
        if (action.payload) {
          state.expenseData.unshift(action.payload);
        }
      })

      /* DELETE */
      .addCase(deleteExpense.fulfilled, (state, action) => {
        if (action.payload) {
          state.expenseData = state.expenseData.filter(
            (e) => e.id !== action.payload
          );
        }
      })

      /* EDIT */
      .addCase(editExpense.fulfilled, (state, action) => {
        if (action.payload) {
          state.expenseData = state.expenseData.map((e) =>
            e.id === action.payload.id ? action.payload : e
          );
        }
      });
  },
});

export default expensesSlice.reducer;

/* ================= SELECTOR ================= */
export const selectSummary = (state) => {
  const data = state.expenses.expenseData;

  let income = 0;
  let expense = 0;

  data.forEach((item) => {
    const amount = Number(item.money);

    if (item.category === "Salary") {
      income += amount;
    } else {
      expense += amount;
    }
  });

  return {
    income,
    expense,
    balance: income - expense,
  };
};