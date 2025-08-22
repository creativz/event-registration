import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
// import AboutSection from './components/AboutSection';
import RegistrationForm from './components/RegistrationForm';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import QRVerification from './components/QRVerification';
import AttendanceDashboard from './components/AttendanceDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import bgSmokeLeft from './assets/bg-smoke-tl.webp';
import bgSmokeRight from './assets/bg-smoke-br.webp';

const MainPage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <section id="registration" className="py-16 bg-white relative">
          <img src={bgSmokeLeft} alt="Background Smoke Left" className="absolute top-0 left-0 w-1/4 z-1" />
          <img src={bgSmokeRight} alt="Background Smoke Right" className="absolute bottom-0 right-0 w-1/4 z-1" />
          <div className="container mx-auto px-4 relative z-2">
            <div className="max-w-4xl mx-auto">
              <RegistrationForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/admin/login" element={
              <ProtectedRoute requireAuth={false}>
                <AdminLogin />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireAuth={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/verify" element={
              <ProtectedRoute requireAuth={true}>
                <QRVerification />
              </ProtectedRoute>
            } />
            <Route path="/attendance" element={
              <ProtectedRoute requireAuth={true}>
                <AttendanceDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
