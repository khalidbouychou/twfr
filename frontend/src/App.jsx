import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import HeroSection from "./components/Hero";
import Faq from "./components/Faq";
import MainSections from "./components/MainSections";
import HowItWorks from "./components/HowItWorks";
import Products from "./components/Products";
import Reviews from "./components/Feedbacks";
import News from "./components/News";
import Footer from "./components/Footer";
import Contactus from "./components/Contactus";
import { AuthProvider, Login as AuthLogin, Signup as AuthSignup } from "./components/Auth";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Layout from "./components/Layout";
import UserProfiling from "./components/UserProfiling";
import UserProfilingDemo from "./components/UserProfilingDemo";
import { FinancialProfilingStepper } from './components/Profiling';
import { UserDashboard } from './components/Dashboard';
import { UserProvider } from './components/Context/UserContext';
import InvestmentDemo from './components/Invest/InvestmentDemo';
import InvestmentSimulation from './components/Invest/InvestmentSimulation';
import InvestmentTest from './components/Invest/InvestmentTest';
import InvestmentDebug from './components/Invest/InvestmentDebug';

const LandingPage = () => (
  <>
    <Navbar />
    <HeroSection />
    <MainSections />
    <HowItWorks />
    <Products />
    <News />
    <Reviews />
    <Faq />
    <Contactus />
    <Footer />
  </>
);

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000
    });
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => {
      clearTimeout(timer);
      AOS.refresh();
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0F0F19] z-50">
        <div className="w-10 h-10 border-4 border-[#3CD4AB] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <UserProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={
              <ProtectedRoute requireAuth={false}>
                <AuthLogin />
              </ProtectedRoute>
            } />
            <Route path="/signup" element={
              <ProtectedRoute requireAuth={false}>
                <AuthSignup />
              </ProtectedRoute>
            } />
            
            {/* Protected routes - require authentication */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireAuth={true}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/investment" element={
              <ProtectedRoute requireAuth={true}>
                <InvestmentDemo />
              </ProtectedRoute>
            } />
            <Route path="/simulation" element={
              <ProtectedRoute requireAuth={true}>
                <UserProfiling />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </UserProvider>
  );
};

export default App;
