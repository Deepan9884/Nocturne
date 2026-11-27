import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/components/cinema/LandingPage";
import CinemaDashboard from "@/components/dashboard/CinemaDashboard";
import AuthPage from "@/components/auth/AuthPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<CinemaDashboard />} />
      <Route path="/login" element={<AuthPage initialMode="login" />} />
      <Route path="/signup" element={<AuthPage initialMode="signup" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
