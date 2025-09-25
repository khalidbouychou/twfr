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
    <section className="w-full py-10 " data-aos="fade-up">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#3CD4AB]">
          Comment TawfirAI vous aide à investir
        </h2>
        <p className="text-[#e4e4e4] text-base md:text-lg mb-12 max-w-2xl mx-auto ">
          Découvrez comment TawfirAI simplifie votre parcours d'investissement en trois étapes simples et personnalisées.
        </p>
        <div className="relative flex flex-col items-center mb-12 text-white">
          {steps.map((step, idx) => (
            <React.Fragment key={step.title}>
              <div className="flex items-center w-full">
                <div className="flex flex-col items-center mr-6">
                  <div className="flex items-center justify-center rounded-full    shadow-md mb-2">
                    <img src={step.img} alt={step.title} className="w-30 h-30 object-contain" />
                  </div>
                  {/* Connector: show between steps except last */}
                  {idx < steps.length - 1 && (
                    <div className="flex flex-col items-center">
                      <svg height="48" width="4" className="my-1">
                        <line x1="2" y1="0" x2="2" y2="48" stroke="#3CD4AB" strokeWidth="3" strokeDasharray="8 6" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold mb-1 text-white">{step.title}</h3>
                  <p className="text-[#e4e4e4] text-sm md:text-base">{step.desc}</p>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
        <a href="/simulation">
        <button className="mt-4 px-8 py-3 bg-[#3CD4AB] text-white text-lg font-bold rounded-full shadow-lg hover:bg-[#89559F] transition-colors duration-200">
          Démarrer votre simulation
        </button>
        </a>
      </div>
    </section>
  );
};

export default HowItWorks; 

