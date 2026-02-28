import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Standard imports for absolute stability
import Home from './pages/Home';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import DoctorDashboard from './pages/dashboard/DoctorDashboard';
import ReceptionistDashboard from './pages/dashboard/ReceptionistDashboard';
import PatientDashboard from './pages/dashboard/PatientDashboard';
import Product from './pages/Product';
import Solutions from './pages/Solutions';
import Pricing from './pages/Pricing';
import Resources from './pages/Resources';

// Component imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/auth/LoginModal';

const AppRoutes = ({ onOpenLogin }) => {
  const { user, role, loading } = useAuth();

  // Loading Guard: Ensure we never show a blank screen during auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Initializing...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home onOpenLogin={onOpenLogin} />} />
      <Route path="/product" element={<Product onOpenLogin={onOpenLogin} />} />
      <Route path="/solutions" element={<Solutions onOpenLogin={onOpenLogin} />} />
      <Route path="/pricing" element={<Pricing onOpenLogin={onOpenLogin} />} />
      <Route path="/resources" element={<Resources onOpenLogin={onOpenLogin} />} />

      {/* Role-Based Dashboard Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/receptionist/*"
        element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <ReceptionistDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/*"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      {/* Redirects */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <AuthProvider>
      <AppLayout onOpenLogin={() => setIsLoginModalOpen(true)}>
        <AppRoutes onOpenLogin={() => setIsLoginModalOpen(true)} />
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      </AppLayout>
    </AuthProvider>
  );
}

function AppLayout({ children, onOpenLogin }) {
  const location = useLocation();
  const path = location.pathname;
  
  // Safe Dashboard Check
  const isDashboard = path.startsWith('/admin') || 
                      path.startsWith('/doctor') || 
                      path.startsWith('/receptionist') || 
                      path.startsWith('/patient');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isDashboard && <Navbar onOpenLogin={onOpenLogin} />}
      <main className="flex-1">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}

export default App;
