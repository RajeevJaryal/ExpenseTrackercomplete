import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const { id } = useParams();

  const { loading, expenseData } = useSelector((s) => s.expenses);

  const [form, setForm] = useState({
    money: "",
    description: "",
    category: "Food",
  });

  const [editingId, setEditingId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [lastAmount, setLastAmount] = useState(0);

  /* EDIT MODE AUTO FILL */
  useEffect(() => {
    if (id && expenseData.length > 0) {
      const foundExpense = expenseData.find((item) => item.id === id);

      if (foundExpense) {
        setForm({
          money: foundExpense.money,
          description: foundExpense.description,
          category: foundExpense.category,
        });

        setEditingId(foundExpense.id);
      }
    }
  }, [id, expenseData]);

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
    navigate("/expense-form");
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
        })
      );

      navigate("/header");
    } else {
      dispatch(addExpense(payload));

      setLastAmount(payload.money);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
      }, 2000);

      resetForm();
    }
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
        {submitted && (
          <div className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-400 text-sm font-medium">
            ✅ ₹{lastAmount} Saved Successfully
          </div>
        )}

        {/* CARD */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-8 shadow-2xl">
          {/* TOP */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-400 mb-3">
              {editingId
                ? "Update your transaction"
                : "Track your spending"}
            </p>

            <div className="flex justify-center items-center gap-3">
              <span className="text-4xl sm:text-5xl text-violet-400 font-bold">
                ₹
              </span>

              <input
                type="number"
                value={form.money}
                onChange={(e) => handleChange("money", e.target.value)}
                placeholder="0"
                className="bg-transparent w-40 sm:w-52 text-center text-4xl sm:text-6xl font-bold outline-none placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={submit} className="space-y-6">
            {/* CATEGORY */}
            <div>
              <p className="text-sm text-gray-400 mb-3">
                Select Category
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => handleChange("category", cat.label)}
                    className={`rounded-2xl p-3 text-sm border transition ${
                      form.category === cat.label
                        ? "bg-gradient-to-r from-violet-600 to-pink-500 border-transparent"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="text-xl mb-1">{cat.icon}</div>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <p className="text-sm text-gray-400 mb-3">
                Description
              </p>

              <textarea
                rows="3"
                value={form.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                placeholder="Enter expense details..."
                className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 outline-none resize-none focus:border-violet-500"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:flex-1 rounded-2xl border border-white/10 py-3 font-medium hover:bg-white/5"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:flex-1 rounded-2xl py-3 font-semibold bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 transition"
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