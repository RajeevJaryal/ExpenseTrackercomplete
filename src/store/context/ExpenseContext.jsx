import React, { createContext, useEffect, useState } from "react";
import firebaseAPI from "../../api/firebase";

export const ExpenseContext = createContext();

const ExpenseProvider = ({ children }) => {
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* 🔹 ADD EXPENSE (POST) */
  const addData = async (expense) => {
    setLoading(true);
    try {
      const response = await firebaseAPI.post("/expenses.json", expense);

      if (response.status === 200) {
        setExpenseData((prev) => [
          { id: response.data.name, ...expense },
          ...prev,
        ]);
      }
    } catch (error) {
      alert("Failed to add expense");
    }
    setLoading(false);
  };

  /* 🔹 FETCH EXPENSES (GET) */
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await firebaseAPI.get("/expenses.json");

      if (response.status === 200 && response.data) {
        const loadedExpenses = Object.keys(response.data).map((key) => ({
          id: key,
          ...response.data[key],
        }));

        setExpenseData(loadedExpenses.reverse());
      }
    } catch (error) {
      alert("Failed to load expenses");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenseData,
        addData,
        loading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseProvider;
