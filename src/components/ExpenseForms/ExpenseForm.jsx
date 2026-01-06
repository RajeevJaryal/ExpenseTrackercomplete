import React, { useContext, useState } from "react";
import { ExpenseContext } from "../../store/context/ExpenseContext";
import PrintExpense from "./PrintExpense";
import "./ExpenseForm.css";

const ExpenseForm = () => {
  const { addData, loading } = useContext(ExpenseContext);

  const [money, setMoney] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");

  const submitHandler = (e) => {
    e.preventDefault();

    addData({
      money: Number(money),
      description,
      category,
    });

    setMoney("");
    setDescription("");
    setCategory("Food");
  };

  return (
    <section className="expense-container">
      <form className="expense-form" onSubmit={submitHandler}>
        <h3>Add Expense</h3>

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
          {loading ? "Saving..." : "Save Expense"}
        </button>
      </form>

      <PrintExpense />
    </section>
  );
};

export default ExpenseForm;
