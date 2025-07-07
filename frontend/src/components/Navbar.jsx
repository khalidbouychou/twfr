import React, { useState } from 'react';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProductsMenu = () => {
    setIsProductsMenuOpen(!isProductsMenuOpen);
  };

  return (
    <nav className="shadow-lg top-0 z-10">
      <div className="max-w-7xl mx-auto  py-4 flex items-center justify-between">
        {/* Logo */}
        <img src="/logo.svg" alt="tawfirai" className="h-15 w-auto" />

        {/* Burger menu */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className={`absolute md:relative top-16 left-0 w-full bg-white md:bg-transparent shadow-lg md:shadow-none md:flex md:w-auto ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className="flex flex-col md:flex-row md:space-x-8 text-lg text-center">
                <a href="#home" className="text-gray-800 md:text-white font-bold px-6 py-2 rounded-full block md:inline-block">Accueil</a>
                <a href="#About us" className="text-gray-800 md:text-white hover:text-accent hover:text-[#89559F] hover:font-bold px-6 py-2 rounded-full block md:inline-block">TawfirAI ?</a>
                <div className="relative" onMouseEnter={() => setIsProductsMenuOpen(true)} onMouseLeave={() => setIsProductsMenuOpen(false)}>
                    <a href="#Products" className="text-gray-800 md:text-white hover:text-accent hover:text-[#89559F] hover:font-bold px-6 py-2 rounded-full block md:inline-block">Nos Produits</a>
                    {isProductsMenuOpen && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                            <a href="#assurance" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">assurance</a>
                            <a href="#egange-a-vie" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">egange a vie</a>
                            <a href="#crypto" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">crypto</a>
                        </div>
                    )}
                </div>
                <a href="#pricing" className="text-gray-800 md:text-white hover:text-accent hover:text-[#89559F] hover:font-bold px-6 py-2 rounded-full block md:inline-block">Tarifs</a>
                <a href="#contact" className="text-gray-800 md:text-white hover:text-accent hover:text-[#89559F] hover:font-bold px-6 py-2 rounded-full block md:inline-block">Contact</a>
            </div>
        </div>

        {/* CTA Button */}
        <div className={`hidden md:flex items-center text-lg gap-4`}>
          <a href="#start-simulation" className="text-[#3CD4AB] px-6 py-2 bg-accent rounded-full text-lg hover:bg-[#89559F] hover:text-white">
            Commencez la simulation
          </a>
          <a href="#Login" className="text-white px-6 py-2 bg-accent rounded-full text-lg hover:text-[#89559F]">
            Se connecter
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
