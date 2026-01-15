import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import firebaseAPI from "../api/firebase";

/* GET EXPENSES */
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async () => {
    const response = await firebaseAPI.get("/expenses.json");
    const data = response.data;

    if (!data) return [];

    return Object.keys(data)
      .map((key) => ({ id: key, ...data[key] }))
      .reverse();
  }
);

/*  ADD EXPENSE */
export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (expense) => {
    const response = await firebaseAPI.post("/expenses.json", expense);
    return { id: response.data.name, ...expense };
  }
);

/* DELETE EXPENSE */
export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id) => {
    await firebaseAPI.delete(`/expenses/${id}.json`); 
    return id;
  }
);

/* EDIT EXPENSE */
export const editExpense = createAsyncThunk(
  "expenses/editExpense",
  async ({ id, updatedExpense }) => {
    await firebaseAPI.put(`/expenses/${id}.json`, updatedExpense); 
    return { id, ...updatedExpense };
  }
);

const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    expenseData: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    /* FETCH */
    builder.addCase(fetchExpenses.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchExpenses.fulfilled, (state, action) => {
      state.loading = false;
      state.expenseData = action.payload;
    });

    /* ADD */
    builder.addCase(addExpense.fulfilled, (state, action) => {
      state.expenseData.unshift(action.payload);
    });

    /* DELETE */
    builder.addCase(deleteExpense.fulfilled, (state, action) => {
      state.expenseData = state.expenseData.filter(
        (ex) => ex.id !== action.payload
      );
    });

    /* EDIT */
    builder.addCase(editExpense.fulfilled, (state, action) => {
      state.expenseData = state.expenseData.map((ex) =>
        ex.id === action.payload.id ? action.payload : ex
      );
    });
  },
});

export default expensesSlice.reducer;
export const selectTotalAmount = (state) =>
  state.expenses.expenseData.reduce((sum, ex) => sum + Number(ex.money), 0);
