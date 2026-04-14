import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddReading from "./pages/AddReading";
import EditReading from "./pages/EditReading";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Readings from "./pages/Readings";
import { useAuth } from "./context/useAuth";

function App() {
  const { token } = useAuth();
  const location = useLocation();
  const hideNavbar =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");

  return (
    <>
      {token && !hideNavbar && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-reading"
          element={
            <ProtectedRoute>
              <AddReading />
            </ProtectedRoute>
          }
        />

        <Route
          path="/readings"
          element={
            <ProtectedRoute>
              <Readings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-reading/:id"
          element={
            <ProtectedRoute>
              <EditReading />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
