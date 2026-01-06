import React, { useContext } from "react";
import { ExpenseContext } from "../../store/context/ExpenseContext";
import "./PrintExpense.css";

const PrintExpense = () => {
  const { removeData, expenseData } = useContext(ExpenseContext);

  if (expenseData.length === 0) {
    return <p className="empty-text">No expenses added yet</p>;
  }

  return (
    <div className="expense-list">
      {expenseData.map((item) => (
        <div className="expense-card" key={item.id}>
          <div className="expense-info">
            <h4>₹{item.money}</h4>
            <p>{item.description}</p>
            <span className="expense-category">{item.category}</span>
          </div>

          <button
            className="remove-btn"
            onClick={() => removeData(item.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default PrintExpense;
