import React, { useContext, useState } from "react";
import { ExpenseContext } from "../../store/context/ExpenseContext";
import PrintExpense from "./PrintExpense";
import "./ExpenseForm.css";

const ExpenseForm = () => {
  const { addData } = useContext(ExpenseContext);
  const [money, setMoney] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");

  const addToForm = (e) => {
    e.preventDefault();

    addData({
      id: Date.now(),
      money: Number(money),
      description,
      category,
    });

    setMoney("");
    setDescription("");
    setCategory("Food");
  };

  return (
    <section className="expense-section">
      <form className="expense-form" onSubmit={addToForm}>
        <div className="form-group">
          <label htmlFor="moneySpent">Money Spent</label>
          <input
            type="number"
            id="moneySpent"
            placeholder="Enter spent money"
            value={money}
            onChange={(e) => setMoney(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Enter where you spent and what you spent"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expenseCategory">Category</label>
          <select
            id="expenseCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Food">Food</option>
            <option value="Petrol">Petrol</option>
            <option value="Salary">Salary</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Save
        </button>
      </form>

      <PrintExpense />
    </section>
  );
};

export default ExpenseForm;
