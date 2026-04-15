import React, { memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteExpense } from "../../store/expensesSlice";

/* ICONS */
const CATEGORY_MAP = {
  Food: "🍔",
  Petrol: "⛽",
  Salary: "💼",
  Entertainment: "🎬",
  Shopping: "🛍️",
  Health: "💊",
  Bills: "📄",
  Other: "✨",
};

const PrintExpense = ({ onEdit }) => {
  const dispatch = useDispatch();
  const { expenseData, loading } = useSelector((state) => state.expenses);

  /* LOADING */
  if (loading) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center text-gray-400 animate-pulse">
        Loading expenses...
      </div>
    );
  }

  /* EMPTY */
  if (!expenseData.length) {
    return (
      <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center text-gray-400">
        No expenses added yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {expenseData.map((item) => (
        <ExpenseCard
          key={item.id}
          item={item}
          onDelete={() => dispatch(deleteExpense(item.id))}
          onEdit={() => onEdit(item)}
        />
      ))}
    </div>
  );
};

/* CARD */
const ExpenseCard = memo(({ item, onDelete, onEdit }) => {
  const isIncome = item.category === "Salary";

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 hover:bg-white/10 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300">

      {/* TOP */}
      <div className="flex justify-between items-start gap-4 mb-4">

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600/30 to-pink-500/20 flex items-center justify-center text-xl border border-white/10">
            {CATEGORY_MAP[item.category] || "✨"}
          </div>

          <div>
            <h3 className="font-semibold text-white text-base">
              {item.category}
            </h3>

            <p className="text-xs text-gray-400">
              Expense Category
            </p>
          </div>
        </div>

        <div className="text-right">
          <h2
            className={`text-xl font-bold ${
              isIncome ? "text-emerald-400" : "text-pink-400"
            }`}
          >
            {isIncome ? "+" : "-"}₹
            {Number(item.money).toLocaleString("en-IN")}
          </h2>

          <span className="text-xs text-gray-500">
            Transaction
          </span>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mb-5">
        <p className="text-sm text-gray-300 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center">

        <span className="px-3 py-1 rounded-full text-xs bg-violet-500/10 text-violet-300 border border-violet-500/20">
          {item.category}
        </span>

        <div className="flex gap-2">

          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-xl text-sm bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-xl text-sm bg-red-500/15 text-red-400 hover:bg-red-500/25 transition"
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
});

export default PrintExpense;