import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './components/Navbar';
import HeroSection from './components/Hero';

import Faq from './components/Faq';

import MainSections from './components/MainSections'; 
import HowItWorks from './components/HowItWorks';
import Products from './components/Products'
import Reviews from './components/Feedbacks'
import News from './components/News'
import Footer from './components/Footer';
import Contactus from './components/Contactus';
import Signin from './components/SigninSignup/Signin';
import Signin_Signup from './components/SigninSignup/Signin_Signup';
// Assuming this is a component you want to include



const App = () => {
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   AOS.init({
  //     duration: 1000, // Set your AOS duration here
  //   });
  //   // Simulate loading for 2 seconds on first launch
  //   const timer = setTimeout(() => setLoading(false), 2000);
  //   return () => {
  //     clearTimeout(timer);
  //     AOS.refresh();  // Refresh AOS when the component unmounts
  //   };
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0F0F19] z-50">
  //       <img src="/logo.svg" alt="TawfirAI Logo" className="w-20 h-20 mb-8 animate-bounce" />
  //       <div className="w-10 h-10 border-4 border-[#3CD4AB] border-t-transparent rounded-full animate-spin"></div>
  //       {/* <span className="mt-6 text-white text-lg font-semibold">Chargement...</span> */}
  //     </div>
  //   );
  // }

  return (
    <>
      <Signin/>
      {/* <Navbar  />
      <HeroSection  />
      <MainSections  />
      <HowItWorks  />
      <Products />
      <News/>
      <Reviews/>
      <Faq />
      <Contactus/>
      <Footer /> */}
    </>
  );
};

export default App;
