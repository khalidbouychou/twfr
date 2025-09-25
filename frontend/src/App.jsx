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
import Login from './components/Login/Login';
import Stepper from './components/Profiling/Stepper';
import TawfirStats from "./components/TawfirState";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Loader from "./components/Loader";


const LandingPage = () => (
  <>
    <Navbar />
    <HeroSection />
    <MainSections />
    <HowItWorks />
    <Products />
    <TawfirStats/>
    <News />
    <Reviews />
    <Faq />
    <Contactus />
    <Footer />
  </>
);

function RequireAuth({ children }) {
  const { isLoggedIn } = useContext(UserContext);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function RedirectIfAuth({ children }) {
  const { isLoggedIn } = useContext(UserContext);
  return !isLoggedIn ? children : <Navigate to="/dashboard" replace />;
}

const App = () => {
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
      <div className="fixed inset-0 flex flex-col items-center justify-center  z-50">
        <Loader />
      </div>
    );
  }

 

  return (
      <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/test" element={<Test/>} /> */}
          {/* Public routes */}
            <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
          <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
            {/* <Route path="/dashboard" element<>
           <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
              <h1 className="text-2xl font-bold">Tableau de bord</h1>
              <p className="text-gray-500">Le tableau de bord est en cours de développement...</p>
              <p className="text-gray-500">Bientôt, vous pourrez consulter votre portefeuille et vos investissements ici.</p>
            </div>
          </>} /> */}
          {/* <Route path="/portfolio" element={<InvestmentPortfolio />} /> */}
          <Route path="/simulation" element={<Stepper/>} />
          {/* <Route path="/simulation" element={<FinancialProfilingStepper/>} /> */}
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </GoogleOAuthProvider>
  );
};

export default App;
