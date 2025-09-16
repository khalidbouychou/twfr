import React, { useState, useEffect, useRef , useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import { Link} from 'react-router-dom';
import {UserContext}  from './Context/UserContext.jsx'
import { PopupModal } from 'react-calendly';
import emailjs from 'emailjs-com';


const Navbar = () => {
  // const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home');
  const productsDropdownRef = useRef(null);
  const { isLoggedIn, userProfileData } = useContext(UserContext);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  
  // EmailJS env configuration
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Lock page scroll when Calendly is open
  useEffect(() => {
    if (!isCalendlyOpen) return;

    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    const prevHtmlOverflow = htmlEl.style.overflow;
    const prevBodyOverflow = bodyEl.style.overflow;
    const prevBodyPosition = bodyEl.style.position;
    const prevBodyTop = bodyEl.style.top;
    const prevBodyLeft = bodyEl.style.left;
    const prevBodyRight = bodyEl.style.right;
    const prevBodyWidth = bodyEl.style.width;

    const scrollY = window.scrollY || window.pageYOffset;

    htmlEl.style.overflow = 'hidden';
    bodyEl.style.overflow = 'hidden';
    bodyEl.style.position = 'fixed';
    bodyEl.style.top = `-${scrollY}px`;
    bodyEl.style.left = '0';
    bodyEl.style.right = '0';
    bodyEl.style.width = '100%';

    return () => {
      htmlEl.style.overflow = prevHtmlOverflow;
      bodyEl.style.overflow = prevBodyOverflow;
      bodyEl.style.position = prevBodyPosition;
      bodyEl.style.top = prevBodyTop;
      bodyEl.style.left = prevBodyLeft;
      bodyEl.style.right = prevBodyRight;
      bodyEl.style.width = prevBodyWidth;
      // Restore scroll position
      const y = Math.abs(parseInt(prevBodyTop || '0', 10)) || scrollY;
      window.scrollTo(0, y);
    };
  }, [isCalendlyOpen]);

  // Close desktop dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        productsDropdownRef.current &&
        !productsDropdownRef.current.contains(event.target)
      ) {
        setIsProductsMenuOpen(false);
      }
    }
    if (isProductsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProductsMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleCalendlyScheduled = (e) => {
    try {
      // Calendly posts a message with payload including invitee
      const payload = e?.data?.payload || e?.data;
      const invitee = payload?.invitee || {};
      const event = payload?.event || {};

      const recipientEmail = invitee.email || userProfileData?.email || userProfileData?.mail || '';
      const recipientName = invitee.name || userProfileData?.fullName || userProfileData?.name || '';

      const templateParams = {
        to_email: recipientEmail,
        to_name: recipientName || 'Client',
        event_name: event.name || 'Rendez-vous',
        event_start_time: event.start_time || '',
        event_end_time: event.end_time || '',
      };

      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY && recipientEmail) {
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      }
    } catch {
      // noop
    } finally {
      setIsCalendlyOpen(false);
    }
  };

  return (
    <nav className=" top-0 w-full   text-white">
  
      <div className="max-w-7xl mx-auto py-4 flex items-center justify-between px-4 md:px-0">
        {/* Logo */}
        <Link to="/">
          <img src="/logo.svg" alt="tawfirai" className="h-15 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <div className=" hidden md:flex md:items-center md:space-x-6 flex-1 justify-center">
          <a
            className={`md:p-2 px-2 py-1 rounded-full transition-colors duration-200 ${activeMenu === 'home' ? 'text-[#3CD4AB] font-bold' : 'hover:text-[#3cd4abc8]'}`}
            href="#home"
            onClick={() => setActiveMenu('home')}
          >Accueil</a>
          <a
            className={`md:p-2 px-2 py-1 rounded-full transition-colors duration-200 ${activeMenu === 'about' ? 'text-[#3CD4AB] font-bold' : 'hover:text-[rgba(60,212,171,0.79)]'}`}
            href="#About us"
            onClick={() => setActiveMenu('about')}
          >TawfirAI ?</a>
          <div
            className="relative"
            ref={productsDropdownRef}
          >
            <button
              className={`flex items-center md:p-2 px-2 py-1 rounded-full transition-colors duration-200 focus:outline-none ${activeMenu === 'products' ? 'text-[#3CD4AB] font-bold' : 'hover:text-[#3cd4abcf]'}`}
              type="button"
              aria-expanded={isProductsMenuOpen}
              aria-controls="desktop-products-dropdown"
              onClick={() => {
                setActiveMenu('products');
                setIsProductsMenuOpen((open) => !open);
              }}
            >
              <span>Nos Produits</span>
              <svg
                className={`ml-2 h-5 w-5 transition-transform duration-200 ${isProductsMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isProductsMenuOpen && (
              <div id="desktop-products-dropdown" className="absolute left-0 mt-2 w-80 bg-[#23234a] rounded-md shadow-lg z-30 flex flex-col">
                <a href="#Compte-sur-Carnet" className="block px-6 py-3 text-base text-gray-200 hover:bg-[#3CD4AB] hover:text-white transition-colors rounded-t-md">Compte sur Carnet</a>
                <a href="#Dépôt-à-Terme" className="block px-6 py-3 text-base text-gray-200 hover:bg-[#3CD4AB] hover:text-white transition-colors">Dépôt à Terme</a>
                <a href="#Gestion-sous-Mandat" className="block px-6 py-3 text-base text-gray-200 hover:bg-[#3CD4AB] hover:text-white transition-colors rounded-b-md">Gestion sous Mandat</a>
                <a href="#OPCVM-Monétaires" className="block px-6 py-3 text-base text-gray-200 hover:bg-[#3CD4AB] hover:text-white transition-colors rounded-b-md">OPCVM Monétaires </a>
                <a href="#OPCVM-Actions" className="block px-6 py-3 text-base text-gray-200 hover:bg-[#3CD4AB] hover:text-white transition-colors rounded-b-md">OPCVM Actions</a>
                <a href="#Produits_Structurés-Capital_Garanti" className="block px-6 py-3 text-base text-gray-200 hover:bg-[#3CD4AB] hover:text-white transition-colors rounded-b-md">Produits Structurés - Capital Garanti</a>
              </div>
            )}
          </div>
          <a
            className={`md:p-2 px-2 py-1 rounded-full transition-colors duration-200 ${activeMenu === 'contact' ? 'text-[#3CD4AB] font-bold' : 'hover:text-[#3cd4abdb]'}`}
            href="#contact"
            onClick={() => setActiveMenu('contact')}
          >Contact</a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/simulation" className="text-[#3CD4AB] px-6 py-2 bg-accent rounded-full text-lg hover:bg-[#3CD4AB] hover:text-white border border-solid border-[#3CD4AB]">
            Simuler un projet
          </Link>
         {console.log(isLoggedIn)}
         {isLoggedIn ? (
          <Link to="/dashboard" className="text-white px-6 py-2 bg-accent rounded-full text-lg hover:bg-[#89559F] border border-solid border-[#89559F]">
            Mon Profile
          </Link>
         ) : (
          <Link  to="/login" className="text-white px-6 py-2 bg-accent rounded-full text-lg hover:bg-[#89559F] border border-solid border-[#89559F]">
            Se connecter
          </Link>
         )}
          <button onClick={() => setIsCalendlyOpen(true)} className="text-white px-6 py-2 bg-accent rounded-full text-lg hover:bg-[#3CD4AB] border border-solid border-[#3CD4AB]">
            Contactez un expert
          </button>

        </div>

        {/* Burger menu */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-[#89559F] focus:outline-none" aria-label="Toggle menu">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-[#191930] z-40 flex flex-col justify-between h-screen w-full transition-all duration-300">
          <div className="flex flex-col items-center pt-8 space-y-6 flex-1 w-full">
            <button
              onClick={closeMenu}
              className="self-end mr-6 mb-4 text-white text-3xl focus:outline-none"
              aria-label="Close menu"
            >
              &times;
            </button>
            <a
              href="#home"
              className={`block py-2 px-4 text-lg rounded-full transition-colors duration-200 w-11/12 ${activeMenu === 'home' ? 'text-[#89559F] font-bold' : 'hover:text-[#89559F] text-white'}`}
              onClick={() => { setActiveMenu('home'); closeMenu(); }}
            >Accueil</a>
            <a
              href="#About us"
              className={`block py-2 px-4 text-lg rounded-full transition-colors duration-200 w-11/12 ${activeMenu === 'about' ? 'text-[#89559F] font-bold' : 'hover:text-[#89559F] text-white'}`}
              onClick={() => { setActiveMenu('about'); closeMenu(); }}
            >TawfirAI ?</a>
            {/* Nos Produits Dropdown */}
            <button
              className={`flex items-center justify-between w-11/12 py-2 px-4 text-lg rounded-full transition-colors duration-200 focus:outline-none ${activeMenu === 'products' ? 'text-[#89559F] font-bold' : 'hover:text-[#89559F] text-white'}`}
              onClick={() => setIsMobileProductsOpen((open) => !open)}
              aria-expanded={isMobileProductsOpen}
              aria-controls="mobile-products-dropdown"
              type="button"
            >
              <span>Nos Produits</span>
              <svg
                className={`ml-2 h-5 w-5 transition-transform duration-200 ${isMobileProductsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isMobileProductsOpen && (
              <div id="mobile-products-dropdown" className="flex flex-col w-10/12 mx-auto bg-[#23234a] rounded-md shadow-lg mt-1 mb-2">
                <a href="#Compte-sur-Carnet" className="block px-6 py-3 text-base text-gray-200 hover:bg-[#89559F] hover:text-white transition-colors rounded-t-md">Compte sur Carnet</a>
                <a href="#Dépôt-à-Terme" className="block px-6 py-3 text-base text-gray-200 hover:bg-[#89559F] hover:text-white transition-colors">Dépôt à Terme</a>
                <a href="#Gestion-sous-Mandat" className="block px-6 py-3 text-base text-gray-200 hover:bg-[#89559F] hover:text-white transition-colors rounded-b-md">Gestion sous Mandat</a>
                <a href="#OPCVM-Monétaires" className="block px-6 py-3 text-base text-gray-200 hover:bg-[#89559F] hover:text-white transition-colors rounded-b-md">OPCVM Monétaires </a>
                <a href="#OPCVM-Actions" className="block px-6 py-3 text-base text-gray-200 hover:bg-[#89559F] hover:text-white transition-colors rounded-b-md">OPCVM Actions</a>
                <a href="#Produits_Structurés-Capital_Garanti" className="block px-6 py-3 text-base text-gray-200 hover:bg-[#89559F] hover:text-white transition-colors rounded-b-md">Produits Structurés - Capital Garanti</a>
              </div>
            )}
            <a
              href="#contact"
              className={`block py-2 px-4 text-lg rounded-full transition-colors duration-200 w-11/12 ${activeMenu === 'contact' ? 'text-[#89559F] font-bold' : 'hover:text-[#89559F] text-white'}`}
              onClick={() => { setActiveMenu('contact'); closeMenu(); }}
            >Contact</a>
            
            <button onClick={() => setIsCalendlyOpen(true)} className="w-11/12 text-center text-white px-6 py-3 bg-accent rounded-full text-lg hover:bg-[#3CD4AB] border border-solid border-[#3CD4AB]">
              Contactez un expert
            </button>
          </div>
          <div className="flex flex-col items-center space-y-4 pb-8">
            <Link to="/simulation" className="w-11/12 text-center text-[#3CD4AB] px-6 py-3 bg-accent rounded-full text-lg hover:bg-[#3CD4AB] hover:text-white border border-solid border-[#3CD4AB]">
              Commencez la simulation
            </Link>
            <Link to="/dashboard" className="w-11/12 text-center text-white px-6 py-3 bg-accent rounded-full text-lg hover:bg-[#89559F] border border-solid border-[#89559F]">
              Mon Profile
            </Link>
            <Link to="/signin" className="w-11/12 text-center text-white px-6 py-3 bg-accent rounded-full text-lg hover:bg-[#89559F] border border-solid border-[#89559F]">
              Se connecter
            </Link>
            <Link to="/signup" className="w-11/12 text-center text-[#3CD4AB] px-6 py-3 border border-[#3CD4AB] rounded-full text-lg hover:bg-[#3CD4AB] hover:text-[#0F0F19] transition-colors">
              S'inscrire
            </Link>
          </div>
        </div>
      )}

      {/* Calendly Modal */}
      <PopupModal
        url={import.meta.env.VITE_CALENDLY_URL || ''}
        onModalClose={() => setIsCalendlyOpen(false)}
        onEventScheduled={handleCalendlyScheduled}
        open={isCalendlyOpen}
        rootElement={document.getElementById('root')}
        prefill={{
          name: userProfileData?.fullName || userProfileData?.name,
          email: userProfileData?.email || userProfileData?.mail,
        }}
       
      />
    </nav>
  );
};

export default Navbar;
