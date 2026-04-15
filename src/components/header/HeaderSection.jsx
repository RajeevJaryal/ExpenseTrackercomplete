import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/AuthReducer";
import {
  deleteExpense,
  selectSummary,
  fetchExpenses,
} from "../../store/expensesSlice";
import { toggleTheme, activatePremium } from "../../store/themeReducer";
import { downloadCSV } from "../../utils/downloadCsv";

const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

export default function HeaderSection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, isVerified, userId } = useSelector((s) => s.auth);
  const { expenseData } = useSelector((s) => s.expenses);
  const { income, expense, balance } = useSelector(selectSummary);
  const { darkMode, premium } = useSelector((s) => s.theme);

  const [verifyLoading, setVerifyLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (userId && token) {
      dispatch(fetchExpenses());
    }
  }, [dispatch, userId, token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleVerifyEmail = async () => {
    setVerifyLoading(true);

    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: token,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error?.message);

      alert("Verification email sent");
    } catch (err) {
      alert(err.message);
    } finally {
      setVerifyLoading(false);
    }
  };

  const categories = ["All", ...new Set(expenseData.map((e) => e.category))];

  const filtered = expenseData.filter((item) => {
    const matchCategory = filter === "All" || item.category === filter;
    const matchSearch = item.description
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 h-16 px-4 md:px-6 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 flex items-center justify-center font-bold shadow-lg">
            ₹
          </div>
          <h1 className="font-bold text-lg tracking-wide">ExpenseTracker</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          {premium && (
            <>
              <button
                onClick={() => dispatch(toggleTheme())}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
              >
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>

              <button
                onClick={() => downloadCSV(expenseData)}
                className="px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm"
              >
                CSV
              </button>
            </>
          )}

          {!premium && (
            <button
              onClick={() => dispatch(activatePremium())}
              className="px-4 py-2 rounded-xl bg-yellow-500 text-black text-sm font-semibold hover:scale-105 transition"
            >
              👑 Premium
            </button>
          )}
          <button
            onClick={() => navigate("/complete-profile")}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm"
          >
            Profile
          </button>
          <button
            onClick={() => navigate("/expense-form")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-sm font-semibold"
          >
            + Add Expense
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm"
          >
            Logout
          </button>
        </div>

        {/* Mobile Burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {!premium && (
        <button
          onClick={() => dispatch(activatePremium())}
          className="w-full text-left px-4 py-3 rounded-xl bg-yellow-500 text-black font-semibold"
        >
          👑 Activate Premium
        </button>
      )}
      {menuOpen && (
        <div className="md:hidden px-4 py-4 border-b border-white/10 bg-slate-950 space-y-3">
          <button
            onClick={() => navigate("/complete-profile")}
            className="w-full text-left px-4 py-3 rounded-xl bg-white/5"
          >
            Profile
          </button>

          <button
            onClick={() => navigate("/expense-form")}
            className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500"
          >
            Add Expense
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-xl border border-red-500/30 text-red-400"
          >
            Logout
          </button>

          {premium && (
            <>
              <button
                onClick={() => dispatch(toggleTheme())}
                className="w-full text-left px-4 py-3 rounded-xl bg-white/5"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>

              <button
                onClick={() => downloadCSV(expenseData)}
                className="w-full text-left px-4 py-3 rounded-xl bg-emerald-500/20 text-emerald-400"
              >
                Download CSV
              </button>
            </>
          )}
        </div>
      )}

      {/* VERIFY */}
      {!isVerified && (
        <div className="px-4 md:px-6 py-3 bg-yellow-500/10 border-b border-yellow-400/20 flex flex-col sm:flex-row gap-3 sm:items-center">
          <span className="text-yellow-400 text-sm">
            Your email is not verified
          </span>

          <button
            onClick={handleVerifyEmail}
            disabled={verifyLoading}
            className="sm:ml-auto px-4 py-2 rounded-lg bg-yellow-500 text-black text-sm font-semibold"
          >
            {verifyLoading ? "Sending..." : "Verify Email"}
          </button>
        </div>
      )}

      {/* BODY */}
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* TITLE */}
        <div className="mb-8">
          <p className="text-gray-400 text-sm mb-1">Welcome back 👋</p>

          <h2 className="text-3xl md:text-5xl font-bold">
            Financial{" "}
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h2>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-gray-400 text-sm mb-2">Balance</p>
            <h3 className="text-3xl font-bold text-violet-400">₹{balance}</h3>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-gray-400 text-sm mb-2">Income</p>
            <h3 className="text-3xl font-bold text-emerald-400">+₹{income}</h3>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-gray-400 text-sm mb-2">Expenses</p>
            <h3 className="text-3xl font-bold text-pink-400">-₹{expense}</h3>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-6 space-y-3">
          <input
            placeholder="Search transaction..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm border ${
                  filter === cat
                    ? "bg-violet-600 border-violet-600"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center mb-6">
            <h3 className="text-xl font-bold">Recent Transactions</h3>

            <button
              onClick={() => navigate("/expense-form")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-sm"
            >
              + Add New
            </button>
          </div>

          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-black/20 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <p className="font-semibold">{item.description}</p>
                  <p className="text-sm text-gray-400">{item.category}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className={`font-bold ${
                      item.category === "Salary"
                        ? "text-emerald-400"
                        : "text-pink-400"
                    }`}
                  >
                    {item.category === "Salary" ? "+" : "-"}₹
                    {Number(item.money).toLocaleString("en-IN")}
                  </span>

                  <button className="text-violet-400 text-sm">Edit</button>

                  <button
                    onClick={() => dispatch(deleteExpense(item.id))}
                    className="text-red-400 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
