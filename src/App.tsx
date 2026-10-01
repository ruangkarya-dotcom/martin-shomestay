import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { BookingPage } from './pages/BookingPage';
import { PaymentPage } from './pages/PaymentPage';
import { BookingSuccessPage } from './pages/BookingSuccessPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { HostDashboardPage } from './pages/HostDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

const RouterContent: React.FC = () => {
  const { currentPath } = useApp();

  const renderPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage />;
    }

    if (currentPath.startsWith('/explore')) {
      return <ExplorePage />;
    }

    if (currentPath.startsWith('/property/')) {
      const propertyId = currentPath.replace('/property/', '').split('?')[0];
      return <PropertyDetailPage propertyId={propertyId} />;
    }

    if (currentPath.startsWith('/booking/success')) {
      return <BookingSuccessPage />;
    }

    if (currentPath.startsWith('/booking')) {
      return <BookingPage />;
    }

    if (currentPath.startsWith('/payment')) {
      return <PaymentPage />;
    }

    if (currentPath.startsWith('/dashboard')) {
      return <UserDashboardPage />;
    }

    if (currentPath.startsWith('/host')) {
      return <HostDashboardPage />;
    }

    if (currentPath.startsWith('/admin')) {
      return <AdminDashboardPage />;
    }

    if (currentPath.startsWith('/login')) {
      return <LoginPage />;
    }

    if (currentPath.startsWith('/register')) {
      return <RegisterPage />;
    }

    if (currentPath.startsWith('/forgot-password')) {
      return <ForgotPasswordPage />;
    }

    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Navbar />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <RouterContent />
    </AppProvider>
  );
}
