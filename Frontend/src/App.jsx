import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import SharedLinkHandler from "./pages/SharedLinkHandler";

// Wrapper to protect routes
import { useContext } from "react";
import AuthContext from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />

            <Route path="/login" element={<Navigate to="/auth" />} />
            <Route path="/register" element={<Navigate to="/auth" />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Navbar />
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route path="/share/:token" element={<SharedLinkHandler />} />
          </Routes>

          <ToastContainer theme="dark" position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
