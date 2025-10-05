import React from 'react';
import { FaEye, FaBullseye, FaFileAlt, FaShieldAlt, FaGraduationCap, FaBolt } from 'react-icons/fa';

const VisionMission = () => {
  return (
    <section className="w-full py-20 bg-[#0b0b17]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
          Vision, Mission et Valeurs Fondamentales
        </h2>
        <p className="text-lg text-gray-300 text-center mb-16 max-w-3xl mx-auto">
          Notre engagement est de révolutionner la finance personnelle grâce à la technologie et à l'éducation.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Vision */}
          <div className="flex flex-col items-center text-center" data-aos="fade-right">
            <div className="mb-6">
              <div className="w-16 h-16 bg-[#89559F] rounded-full flex items-center justify-center">
                <FaEye className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Vision</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Révolutionner la finance personnelle en utilisant l'IA et des outils pédagogiques.
            </p>
          </div>

          {/* Mission */}
          <div className="flex flex-col items-center text-center" data-aos="fade-left">
            <div className="mb-6">
              <div className="w-16 h-16 bg-[#3CD4AB] rounded-full flex items-center justify-center">
                <FaBullseye className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Mission</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Rendre l'épargne simple, accessible et engageante pour tous les profils financiers.
            </p>
          </div>
        </div>

        {/* Core Values Circle */}
        <div className="relative max-w-4xl mx-auto" data-aos="zoom-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Transparency */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#89559F] rounded-full flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300">
                <FaFileAlt className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Transparence</h4>
              <p className="text-gray-400 text-sm">
                Communication claire et honnête sur les produits et les performances.
              </p>
            </div>

            {/* Security */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#89559F] rounded-full flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300">
                <FaShieldAlt className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Sécurité</h4>
              <p className="text-gray-400 text-sm">
                Garantir une protection robuste des données et des actifs des utilisateurs.
              </p>
            </div>

            {/* Pedagogy */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#89559F] rounded-full flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300">
                <FaGraduationCap className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Pédagogie</h4>
              <p className="text-gray-400 text-sm">
                Autonomiser les utilisateurs avec des connaissances et une confiance financières.
              </p>
            </div>

            {/* Innovation */}
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#3CD4AB] rounded-full flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300">
                <FaBolt className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Innovation</h4>
              <p className="text-gray-400 text-sm">
                Exploiter l'IA pour fournir des solutions financières de pointe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
