import React from 'react';

const steps = [
  {
    img: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706741/tawfir-ai/1form.svg',
    title: 'Complétez une simulation',
    desc: 'Renseignez vos informations pour simuler votre investissement.',
  },
  {
    img: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706736/tawfir-ai/msg.svg',

    title: 'Recevez des recommandations personnalisées',
    desc: 'Obtenez des conseils adaptés à votre profil et à vos objectifs.',
  },
  {

    img: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706737/tawfir-ai/dashb.svg',

    title: 'Suivez la performance de votre portefeuille',
    desc: 'Analysez et optimisez vos investissements en temps réel.',
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full py-8 sm:py-10 lg:py-12" data-aos="fade-up">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-[#3CD4AB]">
          Comment TawfirAI vous aide à investir
        </h2>
        <p className="text-[#e4e4e4] text-sm sm:text-base lg:text-lg mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto">
          Découvrez comment TawfirAI simplifie votre parcours d'investissement en trois étapes simples et personnalisées.
        </p>
        <div className="relative flex flex-col items-center mb-8 sm:mb-10 lg:mb-12 text-white">
          {steps.map((step, idx) => (
            <React.Fragment key={step.title}>
              <div className="flex items-start sm:items-center w-full max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-6">
                <div className="flex flex-col items-center mr-4 sm:mr-6 flex-shrink-0">
                  <div className="flex items-center justify-center rounded-full shadow-md mb-2">
                    <img src={step.img} alt={step.title} className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain" />
                  </div>
                  {/* Connector: show between steps except last */}
                  {idx < steps.length - 1 && (
                    <div className="flex flex-col items-center">
                      <svg height="32" width="4" className="my-1 sm:my-2 lg:hidden">
                        <line x1="2" y1="0" x2="2" y2="32" stroke="#3CD4AB" strokeWidth="3" strokeDasharray="6 4" />
                      </svg>
                      <svg height="48" width="4" className="hidden lg:block my-1">
                        <line x1="2" y1="0" x2="2" y2="48" stroke="#3CD4AB" strokeWidth="3" strokeDasharray="8 6" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left sm:text-left">
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1 sm:mb-2 text-white">{step.title}</h3>
                  <p className="text-[#e4e4e4] text-sm sm:text-base lg:text-lg">{step.desc}</p>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <a href="/simulation">
          <button className="mt-4 sm:mt-6 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-[#3CD4AB] text-white text-base sm:text-lg lg:text-xl font-bold rounded-full shadow-lg hover:bg-[#89559F] transition-colors duration-200">
            Démarrer votre simulation
          </button>
        </a>
      </div>
    </section>
  );
};

export default HowItWorks; 

