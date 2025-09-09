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
// import FinancialProfilingStepper from './components/Profiling/FinancialProfilingStepper';
import UserDashboard from './components/Dashboard/UserDashboard';
import InvestmentPortfolio from './components/Invest/InvestmentPortfolio';
import { UserProvider } from './components/Context/UserContext.jsx';
import Login from './components/Login/Login';
import Stepper from './components/Profiling/Stepper';

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
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          {/* <Route path="/portfolio" element={<InvestmentPortfolio />} /> */}
          <Route path="/simulation" element={<Stepper/>} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default App;
