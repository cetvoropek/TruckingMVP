import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './components/Auth/LoginPage';
import { SignupPage } from './components/Auth/SignupPage';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { DriverDashboard } from './components/Dashboard/DriverDashboard';
import { RecruiterDashboard } from './components/Dashboard/RecruiterDashboard';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { DriverProfile } from './components/Driver/DriverProfile';
import { DriverApplications } from './components/Driver/DriverApplications';
import { DriverDocuments } from './components/Driver/DriverDocuments';
import { CandidateSearch } from './components/Recruiter/CandidateSearch';
import { RecruiterMessages } from './components/Recruiter/RecruiterMessages';
import { RecruiterInterviews } from './components/Recruiter/RecruiterInterviews';
import { RecruiterAnalytics } from './components/Recruiter/RecruiterAnalytics';
import { RecruiterSubscription } from './components/Recruiter/RecruiterSubscription';
import { AdminUsers } from './components/Admin/AdminUsers';
import { AdminDatabase } from './components/Admin/AdminDatabase';
import { AdminModeration } from './components/Admin/AdminModeration';
import { AdminSettings } from './components/Admin/AdminSettings';
import { Messages } from './components/Shared/Messages.tsx';
import { useAuth } from './context/AuthContext';

function DashboardRouter() {
  const { profile } = useAuth();

  if (!profile) return null;

  switch (profile.role) {
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
            <Route path="/signup" element={<SignupPage />} />
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
              <Route path="messages" element={<Messages />} />
              
              {/* Driver Routes */}
              <Route path="profile" element={<ProtectedRoute allowedRoles={['driver']}><DriverProfile /></ProtectedRoute>} />
              <Route path="applications" element={<ProtectedRoute allowedRoles={['driver']}><DriverApplications /></ProtectedRoute>} />
              <Route path="documents" element={<ProtectedRoute allowedRoles={['driver']}><DriverDocuments /></ProtectedRoute>} />
              
              {/* Recruiter Routes */}
              <Route path="candidates" element={<ProtectedRoute allowedRoles={['recruiter']}><CandidateSearch /></ProtectedRoute>} />
              <Route path="interviews" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterInterviews /></ProtectedRoute>} />
              <Route path="analytics" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterAnalytics /></ProtectedRoute>} />
              <Route path="subscription" element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterSubscription /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
              <Route path="database" element={<ProtectedRoute allowedRoles={['admin']}><AdminDatabase /></ProtectedRoute>} />
              <Route path="moderation" element={<ProtectedRoute allowedRoles={['admin']}><AdminModeration /></ProtectedRoute>} />
              <Route path="settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;