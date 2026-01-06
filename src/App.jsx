import LoginForm from "./components/form/LoginForm";
import HeaderSection from "./components/header/HeaderSection";
import { Routes, Route } from "react-router-dom";
import CompleteProfile from "./components/header/CompleteProfile";
import ForgotPassword from "./components/form/ForgotPassword";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/header" element={<HeaderSection />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

    </Routes>
  );
}

export default App;
