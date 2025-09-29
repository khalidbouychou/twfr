import React from 'react';

const features = [
  {
    title: 'Des experts à la demande',
    desc: "Vous bénéficiez d'une équipe d'experts issus des plus grandes maisons de gestion pour vous accompagner dans vos projets.",
  },
  {
    title: 'Une activité réglementée',
    desc: "Colbr est enregistrée à l'ORIAS comme CIF, IAS & IOBSP et membre de la CNCGP. A ce titre, les activités de Colbr sont régulées par l'AMF et l'ACPR.",
  },
  {
    title: 'Une offre accessible et transparente',
    desc: "Accédez pour la première fois à l'univers d'investissement des grandes fortunes dès quelques milliers d'euros et pilotez tous vos comptes et investissements depuis votre ordinateur ou votre mobile.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 xl:py-20 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-12 px-4 sm:px-6 lg:px-8">
        {/* Left: Image */}
        <div className="flex-1 flex justify-center lg:justify-start order-2 lg:order-1">
          <img
            src="/assets/why-choose.jpg" // Replace with your image path
            alt="Expert smiling on phone"
            className="w-full max-w-xs sm:max-w-sm lg:max-w-md rounded-2xl object-cover shadow-lg"
          />
        </div>
        {/* Right: Content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[#191930] mb-2 sm:mb-3">Pourquoi choisir TawfirAI ?</h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#89559F] to-[#3CD4AB] rounded-full mb-4 sm:mb-6" />
          <div className="flex flex-col gap-5 sm:gap-6 lg:gap-7 w-full max-w-2xl">
            {features.map((feature, idx) => (
              <div key={feature.title} className="flex items-start gap-3 sm:gap-4 text-left">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#191930] flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-base sm:text-lg lg:text-xl text-[#191930] mb-1 sm:mb-2">{feature.title}</div>
                  <div className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <a
            href="#create-account"
            className="mt-6 sm:mt-8 lg:mt-10 inline-block px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white font-semibold text-base sm:text-lg shadow-lg bg-gradient-to-r from-[#89559F] to-[#3CD4AB] hover:from-[#3CD4AB] hover:to-[#89559F] transition-colors"
          >
            CRÉER VOTRE COMPTE
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs; 