import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchExpenses } from "./store/expensesSlice";

const ExpenseLoader = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchExpenses()); // fetch expenses on app start
  }, [dispatch]);

  return children;
};

export default ExpenseLoader;
