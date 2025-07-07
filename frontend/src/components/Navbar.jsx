import React, { useState } from 'react';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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

        <div class="hidden md:flex md:items-center md:w-auto w-full" id="menu">
            <nav>
                <ul class="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
                    <li><a
  className={`md:p-4 py-3 px-0 block rounded-full transition-colors duration-200 ${activeMenu === 'home' ? 'text-[#89559F] font-bold' : ' hover:text-[#89559F]'}`}
  href="#home"
  onClick={() => setActiveMenu('home')}
>Accueil</a></li>
                    <li><a
  className={`md:p-4 py-3 px-0 block rounded-full transition-colors duration-200 ${activeMenu === 'about' ? 'text-[#89559F] font-bold' : ' hover:text-[#89559F]'}`}
  href="#About us"
  onClick={() => setActiveMenu('about')}
>TawfirAI ?</a></li>
                    <li onMouseEnter={() => setIsProductsMenuOpen(true)} onMouseLeave={() => setIsProductsMenuOpen(false)}>
  <a
    className={`md:p-4 py-3 px-0 block rounded-full transition-colors duration-200 ${activeMenu === 'products' ? 'text-[#89559F] font-bold' : ' hover:text-[#89559F]'}`}
    href="#Products"
    onClick={() => setActiveMenu('products')}
  >Nos Produits</a>
                        {isProductsMenuOpen && (
                            <div class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                                <a href="#assurance" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">assurance</a>
                                <a href="#egange-a-vie" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">egange a vie</a>
                                <a href="#crypto" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">crypto</a>
                            </div>
                        )}
                    </li>
                    <li><a
  className={`md:p-4 py-3 px-0 block rounded-full transition-colors duration-200 ${activeMenu === 'pricing' ? 'text-[#89559F] font-bold' : ' hover:text-[#89559F]'}`}
  href="#pricing"
  onClick={() => setActiveMenu('pricing')}
>Tarifs</a></li>
                    <li><a
  className={`md:p-4 py-3 px-0 block rounded-full transition-colors duration-200 md:mb-0 mb-2 ${activeMenu === 'contact' ? 'text-[#89559F] font-bold' : ' hover:text-[#89559F]'}`}
  href="#contact"
  onClick={() => setActiveMenu('contact')}
>Contact</a></li>
                </ul>
            </nav>
        </div>

        <div class="hidden md:flex items-center space-x-4">
             <a href="#start-simulation" className="text-[#3CD4AB] px-6 py-2 bg-accent rounded-full text-lg hover:bg-[#89559F] hover:text-white">
                Commencez la simulation
              </a>
              <a href="#Login" className="text-white px-6 py-2 bg-accent rounded-full text-lg hover:text-[#89559F]">
                Se connecter
              </a>
        </div>

        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} flex justify-center items-center flex-col  p-4 mt-4 absolute top-18 left-0 w-full bg-[#191930] shadow-lg z-1 text-white`}>
             <a
  href="#home"
  className={`block py-2 px-4 text-sm rounded-full transition-colors duration-200 ${activeMenu === 'home' ? 'text-[#89559F] font-bold' : ' hover:text-[#89559F]'}`}
  onClick={() => setActiveMenu('home')}
>Accueil</a>
             <a
  href="#About us"
  className={`block py-2 px-4 text-sm rounded-full transition-colors duration-200 ${activeMenu === 'about' ? 'text-[#89559F] font-bold' : ' hover:text-[#89559F]'}`}
  onClick={() => setActiveMenu('about')}
>TawfirAI ?</a>
             <a
  href="#Products"
  className={`block py-2 px-4 text-sm rounded-full transition-colors duration-200 ${activeMenu === 'products' ? 'text-[#89559F] font-bold' : ' hover:text-[#89559F]'}`}
  onClick={() => setActiveMenu('products')}
>Nos Produits</a>
             <a
  href="#pricing"
  className={`block py-2 px-4 text-sm rounded-full transition-colors duration-200 ${activeMenu === 'pricing' ? 'text-[#89559F] font-bold' : ' hover:text-[#89559F]'}`}
  onClick={() => setActiveMenu('pricing')}
>Tarifs</a>
             <a
  href="#contact"
  className={`block py-2 px-4 text-sm rounded-full transition-colors duration-200 ${activeMenu === 'contact' ? 'text-[#89559F] font-bold' : ' hover:text-[#89559F]'}`}
  onClick={() => setActiveMenu('contact')}
>Contact</a>
             <div className="flex justify-center items-center flex-col border mt- ">
             <a href="#start-simulation" className="block py-2 px-4 text-sm hover:bg-gray-200 text-[#3CD4AB]">Commencez la simulation</a>
             <a href="#Login" className="block py-2 px-4 text-sm hover:bg-gray-200">Se connecter</a>
             </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
