import React from 'react';
import { FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="mt-16 sm:mt-20 text-white py-12 sm:py-16 lg:py-20 rounded-2xl border-t-2 border-[#3CD4AB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center flex-col">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 w-full">
          {/* Column 1: About */}
          <div className="flex justify-center items-center text-center flex-col gap-4">
            <img src="https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706711/tawfir-ai/logo.png" alt="TawfirAI Logo" className="w-16 h-16 sm:w-20 sm:h-20 mb-2 sm:mb-4"/>
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">À propos</h3>
            <p className="text-gray-400 text-sm sm:text-base max-w-xs sm:max-w-sm">
              Nous sommes une app dédiée à rendre l'épargne et l'investissement accessibles à tous, en utilisant la technologie et l'intelligence artificielle pour simplifier vos décisions financières.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex justify-center items-center text-center flex-col gap-4">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Liens rapides</h3>
            <ul className="text-gray-400 text-sm sm:text-base space-y-2">
              <li><a href="#" className="hover:text-[#3CD4AB] transition-colors">Accueil</a></li>
              <li><a href="#products" className="hover:text-[#3CD4AB] transition-colors">Nos Produits</a></li>
              <li><a href="#faq" className="hover:text-[#3CD4AB] transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="flex justify-center items-center text-center flex-col gap-4">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Contact</h3>
            <div className="space-y-2 mb-4">
              <p className="text-gray-400 text-sm sm:text-base">Email: contact@tawfirai.com</p>
              <p className="text-gray-400 text-sm sm:text-base">Téléphone: +123 456 789</p>
            </div>

            <div className="flex justify-center items-center space-x-4 sm:space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#4267B2] hover:text-[#365899] text-2xl sm:text-3xl transition-colors">
                <FaFacebook />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#0077B5] hover:text-[#005983] text-2xl sm:text-3xl transition-colors">
                <FaLinkedin />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#E1306C] hover:text-[#C13584] text-2xl sm:text-3xl transition-colors">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-8 sm:mt-10 lg:mt-12 border-t border-gray-700 pt-4 sm:pt-6 text-center w-full">
          <p className="text-gray-400 text-xs sm:text-sm">&copy; {new Date().getFullYear()} TawfirAI. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


