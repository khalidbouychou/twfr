import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './components/Navbar';
import HeroSection from './components/Hero';

import Features from './components/Features';

import MainSections from './components/MainSections'; 
import HowItWorks from './components/HowItWorks';
import Products from './components/Products'
import Reviews from './components/Feedbacks'
// Assuming this is a component you want to include



const App = () => {
  useEffect(() => {
  AOS.init({duration:1500})
  });
  return (
    <>
      <Navbar  />
    <div className=' grid place-item-center gap-y-24 overflow-hidden '  >
      <HeroSection  />
      <MainSections  />
      <HowItWorks  />
      <Products />
      <Reviews/>
      {/* <Features /> */}
    </div>
    </>
  );
};

export default App;
