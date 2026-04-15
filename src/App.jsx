import LoginForm from "./components/form/LoginForm";
import HeaderSection from "./components/header/HeaderSection";
import { Routes, Route } from "react-router-dom";
import CompleteProfile from "./components/header/CompleteProfile";
import ForgotPassword from "./components/form/ForgotPassword";
import ExpenseForm from "./components/ExpenseForms/ExpenseForm";
import ExpenseLoader from "./ExpenseLoader";
import { useSelector } from "react-redux";
import "./App.css";

function App() {
  const dark = useSelector((state) => state.theme.darkMode);

  return (
    <div className={dark ? "dark" : "light"}>
      <ExpenseLoader>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/header" element={<HeaderSection />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ADD EXPENSE */}
          <Route path="/expense-form" element={<ExpenseForm />} />

          {/* EDIT EXPENSE */}
          <Route path="/expense-form/:id" element={<ExpenseForm />} />
        </Routes>
      </ExpenseLoader>
    </div>
  );
}

export default App;