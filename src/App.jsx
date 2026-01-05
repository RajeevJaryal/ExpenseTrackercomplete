import LoginForm from "./components/form/LoginForm";
import HeaderSection from "./components/header/HeaderSection";
import { Routes, Route } from "react-router-dom";
import CompleteProfile from "./components/header/CompleteProfile";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/header" element={<HeaderSection />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
    </Routes>
  );
}

export default App;
