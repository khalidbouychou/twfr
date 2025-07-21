import React from 'react';

const sections = [
  {
    img: '../../public/svg_team.svg',
    title: 'Qui sommes-nous ?',
    desc: "Découvrez la vision et l'expertise de Tawfir.AI dans le domaine de l'épargne intelligente",
    bg: 'bg-[#89559F]',
  },
  {
    img: '../../public/saving.svg',
    title: 'Pourquoi épargner ?',
    desc: "Comprendre les bénéfices concrets de l'épargne pour sécuriser votre avenir financier",
    bg: 'bg-[#3CD4AB]',
  },
  {
    img: '../../public/tawfir.svg',
    title: 'Pourquoi Tawfir.AI ?',
    desc: "Notre approche unique, nos valeurs et notre engagement envers votre réussite financière",
    bg: 'bg-[#89559F]',
  },
  {
    img: '../../public/free.svg',
    title: 'Application gratuite',
    desc: "Accès complet sans frais pour tous les utilisateurs",
    bg: 'bg-[#3CD4AB]',
  },
];

const MainSections = () => {
  return (
    <section id="About us" className="w-full py-10 bg-gray-50 rounded-2xl" data-aos="fade-up">
      <h2  className="block text-2xl md:text-4xl font-bold text-center  w-full  mb-15">
        À propos de TawfirAI
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 md:px-0">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`${section.bg} rounded-2xl px-6 py-8 shadow-lg flex flex-col justify-start items-center transition-transform hover:scale-105 duration-200`}
          >
            <div className="w-full mb-4 overflow-hidden rounded-t-xl flex justify-center">
              <img src={section.img} alt="" className="w-40 h-40 object-contain" />
            </div>
            <div className="flex items-center justify-center mb-2">
              <h2 className="text-xl font-bold text-gray-950 text-center mr-2">
                {section.title}
              </h2>
            </div>
            <p className="text-base text-white leading-relaxed text-center">
              {section.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MainSections; 