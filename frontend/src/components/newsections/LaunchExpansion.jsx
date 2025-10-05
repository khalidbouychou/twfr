import React from 'react';
import { FaRocket, FaHandshake, FaGlobeAfrica, FaRobot } from 'react-icons/fa';

const roadmapItems = [
  {
    phase: 'T1 2025',
    title: 'Lancement Initial',
    description: 'Lancement officiel au Maroc, avec un focus sur une expérience utilisateur robuste.',
    number: '1',
    icon: <FaRocket className="w-8 h-8" />,
  },
  {
    phase: 'Phase 2',
    title: 'Intégration Pilote',
    description: 'Intégration avec trois banques partenaires pour tester le modèle B2B2C.',
    number: '2',
    icon: <FaHandshake className="w-8 h-8" />,
  },
  {
    phase: 'Phase 3',
    title: 'Expansion Future',
    description: 'Extension vers d\'autres marchés africains francophones.',
    number: '3',
    icon: <FaGlobeAfrica className="w-8 h-8" />,
  },
  {
    phase: 'Phase 4',
    title: 'Innovation IA',
    description: 'Développement d\'un assistant financier conversationnel IA générative.',
    number: '4',
    icon: <FaRobot className="w-8 h-8" />,
  },
];

const LaunchExpansion = () => {
  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-[#0b0b17] text-center mb-6">
          Perspectives : Lancement et Expansion
        </h2>
        <p className="text-lg text-gray-700 text-center mb-16 max-w-3xl mx-auto">
          Notre feuille de route vise la croissance à travers des partenariats stratégiques et une innovation continue.
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#89559F] hidden md:block"></div>

          <div className="space-y-16">
            {roadmapItems.map((item, index) => (
              <div
                key={item.number}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
                data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
              >
                {/* Content Card */}
                <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#3CD4AB]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-semibold text-[#89559F] bg-[#89559F]/10 px-4 py-1 rounded-full">
                      {item.phase}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#0b0b17] mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>

                {/* Center Circle */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-16 h-16 bg-[#89559F] rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {item.icon}
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="mt-20 text-center">
          <div className="inline-block border-2 border-[#3CD4AB] p-1 rounded-2xl">
            <div className="bg-white px-8 py-6 rounded-2xl">
              <p className="text-xl text-gray-800 font-semibold italic">
                TawfirAI combine l'IA, la finance et le design pour simplifier la gestion de patrimoine et démocratiser l'investissement pour tous.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaunchExpansion;
