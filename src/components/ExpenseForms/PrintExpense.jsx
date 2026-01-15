import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteExpense } from "../../store/expensesSlice";
import "./PrintExpense.css";

const PrintExpense = ({
  setEditingId,
  setMoney,
  setDescription,
  setCategory,
}) => {
  const dispatch = useDispatch();
  const { expenseData, loading } = useSelector((state) => state.expenses);

  if (loading) return <p className="expense-loading">Loading expenses...</p>;
  if (expenseData.length === 0)
    return <p className="expense-empty">No expenses added yet.</p>;

  const handleEdit = (item) => {
    setEditingId(item.id);
    setMoney(item.money);
    setDescription(item.description);
    setCategory(item.category);
  };

  return (
    <div className="expense-list">
      {expenseData.map((item) => (
        <div className="expense-card" key={item.id}>
          <div className="expense-top">
            <h4 className="expense-amount">₹ {item.money}</h4>
            <span className="expense-category">{item.category}</span>
          </div>

          <p className="expense-description">{item.description}</p>

          <div className="expense-actions">
            <button
              className="delete-btn"
              onClick={() => dispatch(deleteExpense(item.id))}
            >
              Delete
            </button>
            <button className="edit-btn" onClick={() => handleEdit(item)}>
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrintExpense;
