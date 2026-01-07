import React, { useContext, useState } from "react";
import { ExpenseContext } from "../../store/context/ExpenseContext";
import PrintExpense from "./PrintExpense";
import "./ExpenseForm.css";

const ExpenseForm = () => {
  const { addData, updateData, loading } = useContext(ExpenseContext);

  const [money, setMoney] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");

  const [editingId, setEditingId] = useState(null);

  const submitHandler = (e) => {
    e.preventDefault();

    const expense = {
      id: editingId ?? Date.now(),
      money: Number(money),
      description,
      category,
    };

    if (editingId) {
      updateData(expense);
    } else {
      addData(expense);
    }

    resetForm();
  };

  const resetForm = () => {
    setMoney("");
    setDescription("");
    setCategory("Food");
    setEditingId(null);
  };

  return (
    <section className="expense-container">
      <form className="expense-form" onSubmit={submitHandler}>
        <h3>{editingId ? "Edit Expense" : "Add Expense"}</h3>

        <input
          type="number"
          value={money}
          onChange={(e) => setMoney(e.target.value)}
          placeholder="Money spent"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Petrol</option>
          <option>Salary</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading
            ? editingId
              ? "Updating..."
              : "Saving..."
            : editingId
            ? "Update Expense"
            : "Save Expense"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      <PrintExpense
        setEditingId={setEditingId}
        setMoney={setMoney}
        setDescription={setDescription}
        setCategory={setCategory}
      />
    </section>
  );
};

export default ExpenseForm;
