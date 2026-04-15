import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addExpense, editExpense } from "../../store/expensesSlice";

const CATEGORIES = [
  { label: "Food", icon: "🍔" },
  { label: "Petrol", icon: "⛽" },
  { label: "Salary", icon: "💼" },
  { label: "Entertainment", icon: "🎬" },
  { label: "Shopping", icon: "🛍️" },
  { label: "Health", icon: "💊" },
  { label: "Bills", icon: "📄" },
  { label: "Other", icon: "✨" },
];

export default function ExpenseForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((s) => s.expenses);

  const [form, setForm] = useState({
    money: "",
    description: "",
    category: "Food",
  });

  const [editingId, setEditingId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [lastAmount, setLastAmount] = useState(0);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      money: "",
      description: "",
      category: "Food",
    });

    setEditingId(null);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.money || !form.description) return;

    const payload = {
      money: Number(form.money),
      description: form.description.trim(),
      category: form.category,
    };

    if (editingId) {
      dispatch(
        editExpense({
          id: editingId,
          updatedExpense: payload,
        }),
      );
    } else {
      dispatch(addExpense(payload));
      setLastAmount(payload.money);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
      }, 2000);
    }

    resetForm();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 h-14 sm:h-16 border-b border-white/10 backdrop-blur-xl bg-white/5 px-4 sm:px-6 flex justify-between items-center">
        <button
          onClick={() => navigate("/header")}
          className="text-xs sm:text-sm text-gray-400 hover:text-white transition"
        >
          ← Dashboard
        </button>

        <h1 className="font-bold text-sm sm:text-lg">
          {editingId ? "Edit Expense" : "Add Expense"}
        </h1>

        <div className="w-10 sm:w-20"></div>
      </nav>

      {/* BODY */}
      <div className="max-w-2xl mx-auto px-4 sm:px-5 py-6 sm:py-10">
        {/* SUCCESS */}
        {submitted && (
          <div className="mb-5 sm:mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 sm:px-5 py-3 sm:py-4 text-emerald-400 text-sm sm:text-base font-medium">
            ✅ ₹{lastAmount} Saved Successfully
          </div>
        )}

        {/* CARD */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-8 shadow-2xl">
          {/* TOP */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
              {editingId ? "Update your transaction" : "Track your spending"}
            </p>

            <div className="flex justify-center items-center gap-2 sm:gap-3">
              <span className="text-3xl sm:text-5xl text-violet-400 font-bold">
                ₹
              </span>

              <input
                type="number"
                value={form.money}
                onChange={(e) => handleChange("money", e.target.value)}
                placeholder="0"
                className="bg-transparent w-28 sm:w-52 text-center text-3xl sm:text-6xl font-bold outline-none placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={submit} className="space-y-5 sm:space-y-6">
            {/* CATEGORY */}
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-3">
                Select Category
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => handleChange("category", cat.label)}
                    className={`rounded-xl sm:rounded-2xl p-2 sm:p-3 text-xs sm:text-sm border transition-all ${
                      form.category === cat.label
                        ? "bg-gradient-to-r from-violet-600 to-pink-500 border-transparent"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-lg sm:text-xl mb-1">{cat.icon}</div>

                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <p className="text-xs sm:text-sm text-gray-400 mb-3">
                Description
              </p>

              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter expense details..."
                className="w-full rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 text-sm sm:text-base outline-none resize-none focus:border-violet-500"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:flex-1 rounded-xl sm:rounded-2xl border border-white/10 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-white/5"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 rounded-xl sm:rounded-2xl py-2 sm:py-3 text-sm sm:text-base font-semibold bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 transition"
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Expense"
                    : "Save Expense"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
