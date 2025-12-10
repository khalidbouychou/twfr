import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "./components/Navbar";
import HeroSection from "./components/Hero";
import Faq from "./components/Faq";
import MainSections from "./components/MainSections";
import HowItWorks from "./components/HowItWorks";
import Products from "./components/Products";
import Reviews from "./components/Reviews";
import News from "./components/News";
import Footer from "./components/Footer";
import Contactus from "./components/Contactus";
import UserDashboard from './components/Dashboard/UserDashboard';
import { UserContext } from './components/Context/UserContext.jsx';
import { AuthProvider, AuthContext } from './components/Context/AuthContext.jsx';
import { CartProvider } from './components/Context/CartContext.jsx';
import Login from './components/Login/Login';
import Stepper from './components/Profiling/Stepper';
import TawfirStats from "./components/TawfirState";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Loader from "./components/Loader";
import AIRecommendation from './components/newsections/AIRecommendation';
import UXPrinciples from './components/newsections/UXPrinciples';
import SecurityCompliance from './components/newsections/SecurityCompliance';


const LandingPage = () => (
  <>
    <Navbar />
    <HeroSection />
    <MainSections />
    <HowItWorks />
    <Products />
    <UXPrinciples />
    <AIRecommendation />
    <TawfirStats/>
    <SecurityCompliance />
    <News />
    <Reviews />
    <Faq />
    <Contactus />
    <Footer />
  </>
);

function AppRoutes() {
  const { isLoggedIn } = useContext(AuthContext);
  const { isLoggedIn: userContextLoggedIn } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

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
      <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
        <Loader />
      </div>
    );
  }

  const isUserLoggedIn = isLoggedIn || userContextLoggedIn;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={!isUserLoggedIn ? <Login /> : <Navigate to="/dashboard" replace />} />
            <Route path="/" element={<LandingPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={isUserLoggedIn ? <UserDashboard /> : <Navigate to="/login" replace />} />
            <Route path="/simulation" element={isUserLoggedIn ? <Stepper /> : <Navigate to="/login" replace />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </GoogleOAuthProvider>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;

// Wrap the entire app with AuthProvider in main.jsx
