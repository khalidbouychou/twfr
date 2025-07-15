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
    <section className="w-full py-12 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 px-4 md:px-0">
        {/* Left: Image */}
        <div className="flex-1 flex justify-center md:justify-start">
          <img
            src="/assets/why-choose.jpg" // Replace with your image path
            alt="Expert smiling on phone"
            className="w-full max-w-md rounded-2xl object-cover shadow-lg"
          />
        </div>
        {/* Right: Content */}
        <div className="flex-1 flex flex-col items-start">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#191930] mb-2">Pourquoi choisir Colbr ?</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#89559F] to-[#3CD4AB] rounded-full mb-6" />
          <div className="flex flex-col gap-7 w-full">
            {features.map((feature, idx) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#191930] flex items-center justify-center text-white font-bold text-lg">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="font-bold text-lg text-[#191930] mb-1">{feature.title}</div>
                  <div className="text-gray-700 text-base leading-relaxed">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <a
            href="#create-account"
            className="mt-10 inline-block px-8 py-4 rounded-full text-white font-semibold text-lg shadow-lg bg-gradient-to-r from-[#89559F] to-[#3CD4AB] hover:from-[#3CD4AB] hover:to-[#89559F] transition-colors"
          >
            CRÉER VOTRE COMPTE
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs; 