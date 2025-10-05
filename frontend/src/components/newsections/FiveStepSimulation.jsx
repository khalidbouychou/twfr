import React from 'react';
import { FaUser, FaPiggyBank, FaChartLine, FaBriefcase, FaLeaf } from 'react-icons/fa';

const steps = [
  {
    number: 1,
    title: 'Profil Sociodémographique',
    description: 'Garantir la conformité KYC (Connaissance du Client).',
    icon: <FaUser className="w-8 h-8" />,
  },
  {
    number: 2,
    title: 'Habitudes d\'Épargne',
    description: 'Comprendre la capacité actuelle et potentielle d\'investissement.',
    icon: <FaPiggyBank className="w-8 h-8" />,
  },
  {
    number: 3,
    title: 'Situation Financière',
    description: 'Un aperçu complet des revenus, actifs et passifs.',
    icon: <FaChartLine className="w-8 h-8" />,
  },
  {
    number: 4,
    title: 'Expérience d\'Investissement',
    description: 'Évaluer la tolérance au risque et les connaissances du marché.',
    icon: <FaBriefcase className="w-8 h-8" />,
  },
  {
    number: 5,
    title: 'Préférences ESG',
    description: 'Aligner les investissements avec les valeurs éthiques et durables.',
    icon: <FaLeaf className="w-8 h-8" />,
  },
];

const FiveStepSimulation = () => {
  return (
    <section className="w-full py-20 bg-[#0b0b17]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
          Mise en Avant : La Simulation en 5 Étapes
        </h2>
        <p className="text-lg text-gray-300 text-center mb-16 max-w-3xl mx-auto">
          Un processus guidé pour déterminer votre stratégie d'investissement optimale, basé sur un profilage personnalisé.
        </p>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="flex items-start gap-6 bg-[#1a1a2e] p-6 rounded-2xl hover:bg-[#252538] transition-all duration-300 border border-[#89559F]"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Icon Circle */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-[#89559F] rounded-full flex items-center justify-center text-white shadow-lg">
                  {step.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-bold text-[#3CD4AB]">{step.number}.</span>
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="/simulation"
            className="inline-block px-8 py-4 bg-[#3CD4AB] text-white font-bold text-lg rounded-full shadow-lg hover:bg-[#2ab88f] hover:shadow-2xl transition-all duration-300"
          >
            Commencer la Simulation
          </a>
        </div>
      </div>
    </section>
  );
};

export default FiveStepSimulation;
