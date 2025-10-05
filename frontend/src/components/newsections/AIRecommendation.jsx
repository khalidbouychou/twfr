import React from 'react';
import { FaStar, FaLeaf, FaSync, FaLightbulb, FaChartBar } from 'react-icons/fa';

const features = [
  {
    title: 'Tolérance au Risque',
    description: 'Évaluation précise basée sur une analyse financière et comportementale.',
    icon: <FaStar className="w-12 h-12" />,
  },
  {
    title: 'Alignement des Valeurs',
    description: 'Intégration des critères Environnementaux, Sociaux et de Gouvernance (ESG).',
    icon: <FaLeaf className="w-12 h-12" />,
  },
  {
    title: 'Ajustement Dynamique',
    description: 'Recommandations automatisées qui s\'adaptent aux changements du marché et à l\'évolution du profil utilisateur.',
    icon: <FaSync className="w-12 h-12" />,
  },
  {
    title: 'Notation par IA',
    description: 'Utilisation de l\'apprentissage automatique pour évaluer la compatibilité des produits avec le profil utilisateur.',
    icon: <FaLightbulb className="w-12 h-12" />,
  },
  {
    title: 'Résultats Visuels',
    description: 'Visualisation claire de l\'allocation du portefeuille et des scénarios alternatifs.',
    icon: <FaChartBar className="w-12 h-12" />,
  },
];

const AIRecommendation = () => {
  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-[#0b0b17] text-center mb-6">
          Moteur de Recommandation Alimenté par l'IA
        </h2>
        <p className="text-lg text-gray-700 text-center mb-16 max-w-3xl mx-auto">
          Au-delà des conseils génériques vers des plans d'investissement dynamiques et personnalisés.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-[#3CD4AB]"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-[#89559F] rounded-full flex items-center justify-center text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#0b0b17] text-center mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-gray-100 p-8 rounded-2xl border-2 border-[#3CD4AB]">
            <p className="text-xl text-gray-800 font-semibold italic">
              "Notre moteur IA combine analyse financière, tolérance au risque et valeurs personnelles pour créer des recommandations d'investissement véritablement personnalisées."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIRecommendation;
