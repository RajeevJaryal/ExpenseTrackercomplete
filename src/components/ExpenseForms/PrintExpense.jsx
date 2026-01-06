import React, { useContext } from "react";
import { ExpenseContext } from "../../store/context/ExpenseContext";
import "./PrintExpense.css";

const PrintExpense = () => {
  const { expenseData, loading } = useContext(ExpenseContext);

  if (loading) return <p className="expense-loading">Loading expenses...</p>;

  if (expenseData.length === 0)
    return <p className="expense-empty">No expenses added yet.</p>;

  return (
    <div className="expense-list">
      {expenseData.map((item) => (
        <div className="expense-card" key={item.id}>
          <div className="expense-top">
            <h4 className="expense-amount">₹ {item.money}</h4>
            <span className="expense-category">{item.category}</span>
          </div>
          <p className="expense-description">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default PrintExpense;
