import React from 'react';

const WhatIsTawfirAI = () => {
  return (
    <section id="what-is-tawfirai" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Qu'est-ce que TawfirAI ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Description Block */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-white mb-4">Votre assistant financier personnalisé</h3>
            <p className="text-lg text-white mb-4">
              TawfirAI est une application mobile innovante conçue pour simplifier l'épargne et les investissements personnels. Elle aide les utilisateurs, quel que soit leur niveau de connaissance financière, à gérer leur argent.
            </p>
            <p className="text-lg text-white">
              Grâce à une simulation intuitive étape par étape, l'application recommande des options d'investissement personnalisées en fonction de vos objectifs, de votre tolérance au risque et de vos valeurs éthiques.
            </p>
          </div>

          {/* Visual or Illustration */}
          <div className="flex justify-center items-center">
            <img src="path_to_image.jpg" alt="TawfirAI illustration" className="w-full max-w-md"/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsTawfirAI;
