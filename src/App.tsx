import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AuthPage from "./components/auth/AuthPage";
import CaseList from "./components/cases/CaseList";
import CaseForm from "./components/cases/CaseForm";
import CaseDetails from "./components/cases/CaseDetails";
import DemoCase from "./components/cases/DemoCase";
import QRScanner from "./components/qr/QRScanner";
import { useAuthStore } from "./store/authStore";
import { supabase } from "./config/supabase";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
}

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user as any);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser((session?.user as any) || null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/cases/demo/:id" element={<DemoCase />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/cases" replace />} />
          <Route path="cases" element={<CaseList />} />
          <Route path="cases/new" element={<CaseForm />} />
          <Route path="cases/:id" element={<CaseDetails />} />
          <Route path="scan" element={<QRScanner />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function AuthCallback() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user as any);
        navigate("/cases");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, setUser]);

  return <div>Processing authentication...</div>;
}

export default App;
