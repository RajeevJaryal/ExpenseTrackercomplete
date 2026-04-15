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
    if (userId && token) dispatch(fetchExpenses());
  }, [dispatch, userId, token]);

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

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
        }
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
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 h-14 px-4 border-b border-white/5 bg-slate-950/80 backdrop-blur-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 flex items-center justify-center text-sm font-bold">
            ₹
          </div>
          <h1 className="text-sm font-semibold tracking-wide">
            ExpenseTracker
          </h1>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-xl"
        >
          ☰
        </button>

        {/* Desktop */}
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => navigate("/expense-form")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500"
          >
            + Add Expense
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-red-500 text-red-400"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden px-4 py-4 border-b border-white/5 bg-slate-950 space-y-3">
          <button
            onClick={() => navigate("/expense-form")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500"
          >
            + Add Expense
          </button>

          <button
            onClick={() => navigate("/complete-profile")}
            className="w-full py-3 rounded-xl bg-white/[0.03]"
          >
            Profile
          </button>

          {!premium && (
            <button
              onClick={() => dispatch(activatePremium())}
              className="w-full py-3 rounded-xl bg-yellow-500 text-black font-semibold"
            >
              👑 Premium
            </button>
          )}

          {premium && (
            <>
              <button
                onClick={() => dispatch(toggleTheme())}
                className="w-full py-3 rounded-xl bg-white/[0.03]"
              >
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>

              <button
                onClick={() => downloadCSV(expenseData)}
                className="w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-400"
              >
                Download CSV
              </button>
            </>
          )}

          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl border border-red-500 text-red-400"
          >
            Logout
          </button>
        </div>
      )}

      {/* VERIFY */}
      {!isVerified && (
        <div className="mx-4 mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-400 mb-3">
            Your email is not verified
          </p>

          <button
            onClick={handleVerifyEmail}
            disabled={verifyLoading}
            className="w-full py-3 rounded-xl bg-yellow-500 text-black font-semibold"
          >
            {verifyLoading ? "Sending..." : "Verify Email"}
          </button>
        </div>
      )}

      {/* BODY */}
      <div className="max-w-7xl mx-auto p-4">
        {/* TITLE */}
        <div className="mb-5">
          <p className="text-gray-400 text-xs">Welcome back 👋</p>

          <h2 className="text-2xl font-bold leading-snug mt-1">
            Financial{" "}
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h2>
        </div>

        {/* STATS */}
        <div className="grid gap-3 mb-5">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-xs text-gray-400 mb-1">Balance</p>
            <h3 className="text-xl font-bold text-violet-400">₹{balance}</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-xs text-gray-400 mb-1">Income</p>
              <h3 className="text-lg font-bold text-emerald-400">
                ₹{income}
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-xs text-gray-400 mb-1">Expense</p>
              <h3 className="text-lg font-bold text-pink-400">
                ₹{expense}
              </h3>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="space-y-3 mb-5">
          <input
            placeholder="Search transaction..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap ${
                  filter === cat
                    ? "bg-violet-600"
                    : "bg-white/[0.03] border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/5"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.category}
                  </p>
                </div>

                <p
                  className={`text-sm font-bold ${
                    item.category === "Salary"
                      ? "text-emerald-400"
                      : "text-pink-400"
                  }`}
                >
                  {item.category === "Salary" ? "+" : "-"}₹
                  {Number(item.money).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 rounded-lg bg-violet-600 text-sm">
                  Edit
                </button>

                <button
                  onClick={() => dispatch(deleteExpense(item.id))}
                  className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}