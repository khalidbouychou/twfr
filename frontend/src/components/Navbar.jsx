import React, { useState, useEffect, useRef , useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import { Link} from 'react-router-dom';
import {UserContext}  from './Context/UserContext.jsx'
import { PopupModal } from 'react-calendly';
import emailjs from 'emailjs-com';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { UserRoundCog, LogOut, Calculator, MessageCircle } from "lucide-react";


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
      const y = Math.abs(parseInt(prevBodyTop || '0', 10) || 0) || scrollY;
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

  const fallbackAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=User';
  
  // Get avatar from multiple possible sources including Google profile
  const getAvatarSrc = () => {
    // First check userProfileData (unified context)
    if (userProfileData?.avatar) return userProfileData.avatar;
    if (userProfileData?.picture) return userProfileData.picture;
    if (userProfileData?.imageUrl) return userProfileData.imageUrl;
    
    // Check Google profile in localStorage
    try {
      const googleProfile = JSON.parse(localStorage.getItem('googleProfile') || '{}');
      if (googleProfile.picture) return googleProfile.picture;
    } catch (e) {
      console.error('Error parsing Google profile:', e);
    }
    
    // Check alternative profile data in localStorage
    try {
      const profileData = JSON.parse(localStorage.getItem('userProfileData') || '{}');
      if (profileData.avatar) return profileData.avatar;
      if (profileData.picture) return profileData.picture;
    } catch (e) {
      console.error('Error parsing profile data:', e);
    }
    
    return fallbackAvatar;
  };
  
  const avatarSrc = getAvatarSrc();

  return (
    <nav className="top-0 w-full text-white">
  
      <div className="max-w-7xl mx-auto py-4 lg:py-8 flex px-4 md:px-6 lg:px-0">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src="/logo.svg" alt="tawfirai" className="h-12 w-12 lg:h-15 lg:w-15" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6 flex-1 justify-center">
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
              <div id="desktop-products-dropdown" className="absolute left-0 mt-2 w-80 bg-[#89559F] opacity-90 rounded-md shadow-lg z-30 flex flex-col">
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

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={toggleMenu}
            className="text-white p-2 rounded-md hover:bg-white/10 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
          <Link to="/simulation" className="flex items-center gap-1 xl:gap-2 text-[#3CD4AB] px-3 xl:px-6 py-2 bg-transparent rounded-full text-sm xl:text-lg hover:bg-[#3CD4AB] hover:text-white transition-all duration-200">
            <Calculator className="w-4 h-4 xl:w-5 xl:h-5" />
            <span className="hidden xl:inline">Simuler un projet</span>
            <span className="xl:hidden">Simuler</span>
          </Link>
          <button onClick={() => setIsCalendlyOpen(true)} className="flex items-center gap-1 xl:gap-2 text-white px-3 xl:px-6 py-2 bg-transparent rounded-full text-sm xl:text-lg hover:bg-[#3CD4AB] transition-all duration-200">
            <MessageCircle className="w-4 h-4 xl:w-5 xl:h-5" />
            <span className="hidden xl:inline">Contactez un expert</span>
            <span className="xl:hidden">Expert</span>
          </button>
         {console.log(isLoggedIn)}
         {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center justify-center">
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover border border-white/20 hover:border-[#89559F] transition-colors"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackAvatar; }}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-[#0F0F19] border border-[#89559F]/30" align="end">
              <div className="p-3 border-b border-white/10">
                <div className="text-white font-medium">
                  {userProfileData?.fullName || userProfileData?.name || "Utilisateur"}
                </div>
              </div>
              <DropdownMenuItem
                onClick={() => window.location.href = '/dashboard'}
                className="text-white hover:bg-white/10 cursor-pointer"
              >
                <UserRoundCog className="w-4 h-4 mr-2" />
                Mon profil
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => {
                  // Clear authentication data
                  localStorage.removeItem('isLogin');
                  localStorage.removeItem('googleProfile');
                  localStorage.removeItem('googleCredential');
                  localStorage.removeItem('userProfileData');
                  
                  // Clear user personal data (name, avatar, etc.)
                  localStorage.removeItem('userContext');
                  localStorage.removeItem('userName');
                  localStorage.removeItem('userAvatar');
                  localStorage.removeItem('userEmail');
                  localStorage.removeItem('fullName');
                  
                  window.location.href = '/login';
                }}
                className="text-red-400 hover:bg-red-400/10 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
         ) : (
          <Link  to="/login" className="text-white px-3 xl:px-6 py-2 bg-accent rounded-full text-sm xl:text-lg hover:bg-[#89559F] border border-solid border-[#89559F]">
            <span className="hidden lg:inline">Se connecter</span>
            <span className="lg:hidden">Login</span>
          </Link>
         )}

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-[#191930] z-40 flex flex-col justify-between h-screen w-full transition-all duration-300">
          <div className="flex flex-col items-center pt-4 space-y-4 flex-1 w-full overflow-y-auto">
            <div className="flex justify-between items-center w-full px-4 mb-4">
              <Link to="/" onClick={closeMenu}>
                <img src="/logo.svg" alt="tawfirai" className="h-10 w-10" />
              </Link>
              <button
                onClick={closeMenu}
                className="text-white p-2 hover:bg-white/10 rounded-md focus:outline-none"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <a
              href="#home"
              className={`block py-3 px-4 text-base rounded-lg transition-colors duration-200 w-11/12 text-center ${activeMenu === 'home' ? 'text-[#3CD4AB] bg-white/10 font-bold' : 'hover:text-[#3CD4AB] hover:bg-white/5 text-white'}`}
              onClick={() => { setActiveMenu('home'); closeMenu(); }}
            >Accueil</a>
            <a
              href="#About us"
              className={`block py-3 px-4 text-base rounded-lg transition-colors duration-200 w-11/12 text-center ${activeMenu === 'about' ? 'text-[#3CD4AB] bg-white/10 font-bold' : 'hover:text-[#3CD4AB] hover:bg-white/5 text-white'}`}
              onClick={() => { setActiveMenu('about'); closeMenu(); }}
            >TawfirAI ?</a>
            {/* Nos Produits Dropdown */}
            <button
              className={`flex items-center justify-between w-11/12 py-3 px-4 text-base rounded-lg transition-colors duration-200 focus:outline-none ${activeMenu === 'products' ? 'text-[#3CD4AB] bg-white/10 font-bold' : 'hover:text-[#3CD4AB] hover:bg-white/5 text-white'}`}
              onClick={() => setIsMobileProductsOpen((open) => !open)}
              aria-expanded={isMobileProductsOpen}
              aria-controls="mobile-products-dropdown"
              type="button"
            >
              <span>Nos Produits</span>
              <svg
                className={`ml-2 h-4 w-4 transition-transform duration-200 ${isMobileProductsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isMobileProductsOpen && (
              <div id="mobile-products-dropdown" className="flex flex-col w-10/12 mx-auto bg-black/50 backdrop-blur-sm rounded-lg shadow-lg mt-2 mb-2 border border-white/10">
                <a href="#Compte-sur-Carnet" className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#3CD4AB] hover:text-white transition-colors first:rounded-t-lg" onClick={closeMenu}>Compte sur Carnet</a>
                <a href="#Dépôt-à-Terme" className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#3CD4AB] hover:text-white transition-colors" onClick={closeMenu}>Dépôt à Terme</a>
                <a href="#Gestion-sous-Mandat" className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#3CD4AB] hover:text-white transition-colors" onClick={closeMenu}>Gestion sous Mandat</a>
                <a href="#OPCVM-Monétaires" className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#3CD4AB] hover:text-white transition-colors" onClick={closeMenu}>OPCVM Monétaires</a>
                <a href="#OPCVM-Actions" className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#3CD4AB] hover:text-white transition-colors" onClick={closeMenu}>OPCVM Actions</a>
                <a href="#Produits_Structurés-Capital_Garanti" className="block px-4 py-2 text-sm text-gray-200 hover:bg-[#3CD4AB] hover:text-white transition-colors last:rounded-b-lg" onClick={closeMenu}>Produits Structurés</a>
              </div>
            )}
            <a
              href="#contact"
              className={`block py-3 px-4 text-base rounded-lg transition-colors duration-200 w-11/12 text-center ${activeMenu === 'contact' ? 'text-[#3CD4AB] bg-white/10 font-bold' : 'hover:text-[#3CD4AB] hover:bg-white/5 text-white'}`}
              onClick={() => { setActiveMenu('contact'); closeMenu(); }}
            >Contact</a>
          </div>
          
          <div className="flex flex-col items-center space-y-3 pb-6 px-4 border-t border-white/10 pt-4">
            <Link to="/simulation" className="flex items-center justify-center gap-2 w-full text-center text-[#3CD4AB] px-4 py-3 bg-transparent border border-[#3CD4AB] rounded-lg text-base hover:bg-[#3CD4AB] hover:text-white transition-all duration-200" onClick={closeMenu}>
              <Calculator className="w-4 h-4" />
              Simuler un projet
            </Link>
            
            <button onClick={() => { setIsCalendlyOpen(true); closeMenu(); }} className="flex items-center justify-center gap-2 w-full text-center text-white px-4 py-3 bg-[#3CD4AB] rounded-lg text-base hover:bg-[#3CD4AB]/80 transition-all duration-200">
              <MessageCircle className="w-4 h-4" />
              Contactez un expert
            </button>
            {isLoggedIn ? (
              <Link to="/dashboard" className="w-full" onClick={closeMenu}>
                <div className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white/5 rounded-lg border border-white/10">
                  <img 
                    src={avatarSrc} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full object-cover border border-white/20" 
                    onError={(e) => { 
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = fallbackAvatar; 
                    }} 
                  />
                  <span className="text-white text-sm">Mon Dashboard</span>
                </div>
              </Link>
            ) : (
              <Link to="/login" className="w-full text-center text-white px-4 py-3 bg-accent rounded-lg text-base hover:bg-[#89559F] border border-solid border-[#89559F]" onClick={closeMenu}>
                Se connecter
              </Link>
            )}
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
