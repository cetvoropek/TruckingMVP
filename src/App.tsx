import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './components/Auth/LoginPage';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { DriverDashboard } from './components/Dashboard/DriverDashboard';
import { RecruiterDashboard } from './components/Dashboard/RecruiterDashboard';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { useAuth } from './context/AuthContext';

function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'driver':
      return <DriverDashboard />;
    case 'recruiter':
      return <RecruiterDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<DashboardRouter />} />
              {/* Add more routes here as needed */}
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;