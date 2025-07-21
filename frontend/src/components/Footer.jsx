import React from 'react';
import { FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className=" mt-20 text-white py-20 rounded-2xl border-t-2 border-[#3CD4AB] ">
      <div className="  mx-auto px-6 sm:px-8 flex justify-center items-center flex-col">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: About */}
          <div className='   flex justify-center items-center flex-col gap-4'>
            <img src="../../public/logo.png" alt=""  className='w-20 h-20 mb-4'/>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <p className="text-gray-400 text-sm">
              Nous sommes une app dédiée à rendre l'épargne et l'investissement accessibles à tous, en utilisant la technologie et l'intelligence artificielle pour simplifier vos décisions financières.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className=" flex justify-center items-center flex-col gap-4">
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="text-gray-400 text-sm">
              <li><a href="#" className="hover:text-[#3CD4AB]">Accueil</a></li>
              <li><a href="#products" className="hover:text-[#3CD4AB]">Nos Produits</a></li>
              <li><a href="#faq" className="hover:text-[#3CD4AB]">FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="flex justify-center items-center flex-col gap-4 " >
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400 text-sm">Email: contact@tawfirai.com</p>
            <p className="text-gray-400 text-sm">Téléphone: +123 456 789</p>

            <div className="flex justify-center items-center space-x-6 ">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#4267B2] hover:text-[#365899] text-3xl">
                <FaFacebook />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[#0077B5] hover:text-[#005983] text-3xl">
                <FaLinkedin />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#E1306C] hover:text-[#C13584] text-3xl">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} TawfirAI. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
