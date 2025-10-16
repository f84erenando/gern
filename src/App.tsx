import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
