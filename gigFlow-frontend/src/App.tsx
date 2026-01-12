import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchCurrentUser } from "./store/slices/authSlice";
import { useSocket } from "./hooks/useSocket";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import NotificationToast from "./components/common/NotificationToast";
import Home from "./components/Home";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import GigFeed from "./components/gigs/GigFeed";
import GigDetail from "./components/gigs/GigDetail";
import CreateGigForm from "./components/gigs/CreateGigForm";
import Dashboard from "./components/dashboard/Dashboard";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { notification } = useSocket();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        {notification && (
          <NotificationToast message={notification} onClose={() => {}} />
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signup"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />
            }
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route path="/gigs" element={<GigFeed />} />
          <Route path="/gigs/:id" element={<GigDetail />} />
          <Route
            path="/create-gig"
            element={
              <ProtectedRoute>
                <CreateGigForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
