import React from 'react';
import { FaWater, FaMobileAlt, FaSmile } from 'react-icons/fa';

const principles = [
  {
    title: 'Fluidité & Simplicité',
    description: 'Minimiser les frictions dans chaque parcours utilisateur.',
    icon: <FaWater className="w-8 h-8" />,
  },
  {
    title: 'Accessibilité Mobile-First',
    description: 'Optimisé pour une gestion en déplacement et des appareils variés.',
    icon: <FaMobileAlt className="w-8 h-8" />,
  },
  {
    title: 'Ton Rassurant',
    description: 'Créer la confiance grâce à une communication claire et éducative.',
    icon: <FaSmile className="w-8 h-8" />,
  },
];

const wireframes = [
  {
    title: 'Écran d\'Accueil',
    description: 'Appel à l\'action clair pour "Démarrer la Simulation".',
  },
  {
    title: 'Questionnaires',
    description: 'Gamification légère pour encourager la complétion.',
  },
  {
    title: 'Tableau de Bord',
    description: 'Suivi interactif des performances en temps réel.',
  },
];

const UXPrinciples = () => {
  return (
    <section className="w-full py-20 bg-[#0b0b17]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
          Concevoir pour les Utilisateurs : Principes UX/UI
        </h2>
        <p className="text-lg text-gray-300 text-center mb-16 max-w-3xl mx-auto">
          Notre conception mobile-first privilégie la clarté, l'accessibilité et la confiance, inspirée des solutions fintech de premier plan.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Principles */}
          <div className="space-y-8">
            {principles.map((principle, index) => (
              <div
                key={principle.title}
                className="flex items-start gap-4 bg-[#1a1a2e] p-6 rounded-xl hover:bg-[#252538] transition-all duration-300 border border-[#89559F]"
                data-aos="fade-right"
                data-aos-delay={index * 100}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#89559F] rounded-lg flex items-center justify-center text-white">
                    {principle.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{principle.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{principle.description}</p>
                </div>
              </div>
            ))}

            {/* Key Wireframes */}
            <div className="mt-8 bg-[#1a1a2e] p-6 rounded-xl border border-[#3CD4AB]">
              <h3 className="text-2xl font-bold text-white mb-4">Maquettes Clés</h3>
              <ul className="space-y-3">
                {wireframes.map((wireframe, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[#3CD4AB] font-bold">•</span>
                    <div>
                      <span className="font-semibold text-white">{wireframe.title}:</span>
                      <span className="text-gray-300 ml-2">{wireframe.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Mobile Mockup */}
          <div className="flex justify-center" data-aos="fade-left">
            <div className="relative">
              <div className="w-[300px] h-[600px] bg-[#89559F] rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-[#1a1a2e] rounded-[2.5rem] overflow-hidden">
                  {/* Phone Screen Content */}
                  <div className="relative h-full flex flex-col">
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 py-3 text-white text-xs">
                      <span>11:47</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-4 bg-white/30 rounded-full"></div>
                        <div className="w-4 h-4 bg-white/30 rounded-full"></div>
                        <div className="w-4 h-4 bg-white/30 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1 px-6 py-4">
                      <div className="bg-[#3CD4AB] rounded-2xl p-6 mb-4">
                        <h4 className="text-white text-2xl font-bold mb-2">123,35 MAD</h4>
                        <p className="text-white/80 text-sm">Solde Total</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white/10 rounded-xl p-4">
                          <div className="h-16 mb-2">
                            <svg className="w-full h-full text-[#3CD4AB]" viewBox="0 0 100 50">
                              <polyline points="0,40 20,35 40,30 60,20 80,25 100,15" fill="none" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </div>
                          <p className="text-white/60 text-xs">Épargne</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4">
                          <div className="h-16 mb-2">
                            <svg className="w-full h-full text-[#3CD4AB]" viewBox="0 0 100 50">
                              <rect x="10" y="30" width="15" height="20" fill="currentColor"/>
                              <rect x="35" y="20" width="15" height="30" fill="currentColor"/>
                              <rect x="60" y="25" width="15" height="25" fill="currentColor"/>
                            </svg>
                          </div>
                          <p className="text-white/60 text-xs">Invest</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/10 rounded-2xl p-4">
                        <h5 className="text-white font-semibold mb-3">Actions Rapides</h5>
                        <div className="space-y-2">
                          <div className="bg-[#3CD4AB] rounded-lg p-3 text-white text-sm text-center font-medium">
                            Démarrer Simulation
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Nav */}
                    <div className="flex justify-around items-center px-6 py-4 border-t border-white/10">
                      <div className="w-8 h-8 bg-[#3CD4AB] rounded-full"></div>
                      <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                      <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                      <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UXPrinciples;
