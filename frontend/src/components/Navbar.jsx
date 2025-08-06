import React, { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home');
  const productsDropdownRef = useRef(null);

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

  return (
    <nav className=" top-0 w-full   text-white">
  
      <div className="max-w-7xl mx-auto py-4 flex items-center justify-between px-4 md:px-0 ">
        {/* Logo */}
        <img src="/logo.svg" alt="tawfirai" className="h-15 w-auto" />

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
          {/* <a
            className={`md:p-2 px-2 py-1 rounded-full transition-colors duration-200 ${activeMenu === 'pricing' ? 'text-[#89559F] font-bold' : 'hover:text-[#89559F]'}`}
            href="#pricing"
            onClick={() => setActiveMenu('pricing')}
          >Tarifs</a> */}
          <a
            className={`md:p-2 px-2 py-1 rounded-full transition-colors duration-200 ${activeMenu === 'contact' ? 'text-[#3CD4AB] font-bold' : 'hover:text-[#3cd4abdb]'}`}
            href="#contact"
            onClick={() => setActiveMenu('contact')}
          >Contactez-nous</a>
          <a
            className={`md:p-2 px-2 py-1 rounded-full transition-colors duration-200 ${activeMenu === 'investment' ? 'text-[#3CD4AB] font-bold' : 'hover:text-[#3cd4abdb]'}`}
            href="/investment"
            onClick={() => setActiveMenu('investment')}
          >Portfolio</a>
          <a
            className={`md:p-2 px-2 py-1 rounded-full transition-colors duration-200 ${activeMenu === 'simulation' ? 'text-[#3CD4AB] font-bold' : 'hover:text-[#3cd4abdb]'}`}
            href="/simulation"
            onClick={() => setActiveMenu('simulation')}
          >Simulation</a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="/simulation" className="text-[#3CD4AB] px-6 py-2 bg-accent rounded-full text-lg hover:bg-[#3CD4AB] hover:text-white  border border-solid border-[##3CD4AB]">
            Simuler un projet           </a>
          {/* <a href="/signin" className="text-white px-6 py-2 bg-accent rounded-full text-lg hover:bg-[#89559F]  border border-solid border-[#89559F]">
            Se connecter
          </a> */}
          <a href="/dashboard" className="text-white px-6 py-2 bg-accent rounded-full text-lg hover:bg-[#89559F]  border border-solid border-[#89559F]">
            Mon Profile
          </a>
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
              href="#pricing"
              className={`block py-2 px-4 text-lg rounded-full transition-colors duration-200 w-11/12 ${activeMenu === 'pricing' ? 'text-[#89559F] font-bold' : 'hover:text-[#89559F] text-white'}`}
              onClick={() => { setActiveMenu('pricing'); closeMenu(); }}
            >Tarifs</a>
            <a
              href="#contact"
              className={`block py-2 px-4 text-lg rounded-full transition-colors duration-200 w-11/12 ${activeMenu === 'contact' ? 'text-[#89559F] font-bold' : 'hover:text-[#89559F] text-white'}`}
              onClick={() => { setActiveMenu('contact'); closeMenu(); }}
            >Contact</a>
            <a
              href="/investment"
              className={`block py-2 px-4 text-lg rounded-full transition-colors duration-200 w-11/12 ${activeMenu === 'investment' ? 'text-[#89559F] font-bold' : 'hover:text-[#89559F] text-white'}`}
              onClick={() => { setActiveMenu('investment'); closeMenu(); }}
            >Portfolio</a>
            <a
              href="/simulation"
              className={`block py-2 px-4 text-lg rounded-full transition-colors duration-200 w-11/12 ${activeMenu === 'simulation' ? 'text-[#89559F] font-bold' : 'hover:text-[#89559F] text-white'}`}
              onClick={() => { setActiveMenu('simulation'); closeMenu(); }}
            >Simulation</a>
          </div>
          <div className="flex flex-col items-center space-y-4 pb-8">
            <a href="/simulation" className="w-11/12 text-center text-[#3CD4AB] px-6 py-3 bg-accent rounded-full text-lg hover:bg-[#3CD4AB] hover:text-white  border border-solid border-[##3CD4AB]">
              Commencez la simulation
            </a>
            <a href="#Login" className="w-11/12 text-center text-white px-6 py-3 bg-accent rounded-full text-lg hover:bg-[#89559F] border border-solid border-[#89559F]">
              Se connecter
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
