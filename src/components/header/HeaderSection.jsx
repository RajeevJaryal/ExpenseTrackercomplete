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
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="sticky top-0 z-50 h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 flex items-center justify-center font-bold text-lg">
            ₹
          </div>

          <h1 className="text-lg font-bold tracking-wide">
            ExpenseTracker
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!premium && (
            <button
              onClick={() => dispatch(activatePremium())}
              className="px-4 py-2 rounded-xl bg-yellow-500 text-black font-semibold"
            >
              👑 Premium
            </button>
          )}

          {premium && (
            <>
              <button
                onClick={() => dispatch(toggleTheme())}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
              >
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>

              <button
                onClick={() => downloadCSV(expenseData)}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400"
              >
                CSV
              </button>
            </>
          )}

          <button
            onClick={() => navigate("/complete-profile")}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-red-500/30 text-red-400"
          >
            Logout
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden px-4 py-4 border-b border-white/10 bg-slate-950 space-y-3">
          <button
            onClick={() => navigate("/complete-profile")}
            className="w-full py-3 rounded-xl bg-white/5"
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
                className="w-full py-3 rounded-xl bg-white/5"
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
            className="w-full py-3 rounded-xl border border-red-500/30 text-red-400"
          >
            Logout
          </button>
        </div>
      )}

      {!isVerified && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex flex-col md:flex-row gap-3 md:items-center">
            <p className="text-yellow-400 text-sm">
              Your email is not verified
            </p>

            <button
              onClick={handleVerifyEmail}
              disabled={verifyLoading}
              className="md:ml-auto px-5 py-2 rounded-xl bg-yellow-500 text-black font-semibold"
            >
              {verifyLoading ? "Sending..." : "Verify Email"}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* HERO */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-gray-400 text-sm mb-2">
              Welcome back 👋
            </p>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Financial{" "}
              <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h2>
          </div>

          <button
            onClick={() => navigate("/expense-form")}
            className="w-fit md:w-auto px-4 py-2 text-sm md:px-5 md:py-3 md:text-base rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 font-semibold hover:opacity-90 transition"
          >
            + Add Expense
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-gray-400 text-sm mb-2">Balance</p>
            <h3 className="text-3xl font-bold text-violet-400">
              ₹{balance}
            </h3>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-gray-400 text-sm mb-2">Income</p>
            <h3 className="text-3xl font-bold text-emerald-400">
              ₹{income}
            </h3>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-gray-400 text-sm mb-2">Expense</p>
            <h3 className="text-3xl font-bold text-pink-400">
              ₹{expense}
            </h3>
          </div>
        </div>

        {/* SEARCH */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Search transaction..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 outline-none"
            />

            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm ${
                    filter === cat
                      ? "bg-violet-600"
                      : "bg-slate-900 border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-xl font-semibold">
              Recent Transactions
            </h3>
          </div>

          <div className="divide-y divide-white/5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-white/[0.03]"
              >
                <div>
                  <p className="font-medium text-base">
                    {item.description}
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    {item.category}
                  </p>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <p
                    className={`text-lg font-bold ${
                      item.category === "Salary"
                        ? "text-emerald-400"
                        : "text-pink-400"
                    }`}
                  >
                    {item.category === "Salary" ? "+" : "-"}₹
                    {Number(item.money).toLocaleString("en-IN")}
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/expense-form/${item.id}`)
                    }
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      dispatch(deleteExpense(item.id))
                    }
                    className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="px-6 py-10 text-center text-gray-400">
                No transactions found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}