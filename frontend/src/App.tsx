import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyWorks from './pages/MyWorks';
import Search from './pages/Search';
import Monitoring from './pages/Monitoring';
import Alerts from './pages/Alerts';
import Takedowns from './pages/Takedowns';
import Settings from './pages/Settings';
import Estimator from './pages/Estimator';

import Landing from './pages/Landing';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center font-bold text-brand-blue">Loading elsamee3...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        {/* Front Landing Page - Simple, Clean, Professional Capabilities Catalog */}
        <Route path="/" element={<Landing />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Public Beta Tool Routes (Accessible directly from landing page button) */}
        <Route element={<Layout />}>
          <Route path="/search" element={<Search />} />
          <Route path="/estimator" element={<Estimator />} />
        </Route>

        {/* Protected Creator Workspace Routes */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/works" element={<MyWorks />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/takedowns" element={<Takedowns />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

