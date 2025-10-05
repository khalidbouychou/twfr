import React from 'react';

const sections = [
  {
    img: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706749/tawfir-ai/svg_team.svg',
    title: 'Qui sommes-nous ?',
    desc: "Découvrez la vision et l'expertise de Tawfir.AI dans le domaine de l'épargne intelligente",
    // bg: 'bg-[#89559F]',
  },
  {
    img: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706747/tawfir-ai/saving.svg',
    title: 'Pourquoi épargner ?',
    desc: "Comprendre les bénéfices concrets de l'épargne pour sécuriser votre avenir financier",
    // bg: 'bg-[#3CD4AB]',
  },
  {
    img: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706746/tawfir-ai/tawfir.svg',
    title: 'Pourquoi Tawfir.AI ?',
    desc: "Notre approche unique, nos valeurs et notre engagement envers votre réussite financière",
    // bg: 'bg-[#89559F]',
  },
  {
    img: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706744/tawfir-ai/free.svg',
    title: 'Application gratuite',
    desc: "Accès complet sans frais pour tous les utilisateurs",
    // bg: 'bg-[#3CD4AB]',
  },
];

const MainSections = () => {
  return (
    <section id="About us" className="w-full py-15 bg-gray-50 rounded-2xl" data-aos="fade-up">
      <h2  className="text-gray-900 block text-2xl md:text-4xl font-bold text-center  w-full  mb-15">
        À propos de TawfirAI
      </h2>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row flex-wrap gap-8 md:px-0">
        {sections.map((section) => (
          <div
            key={section.title}
            className="flex-1 min-w-[300px] md:min-w-[calc(50%-1rem)] rounded-2xl px-8 py-10 shadow-lg hover:shadow-2xl hover:bg-gray-100 flex flex-col justify-start items-center transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer group"
          >
            <div className="w-full mb-6 overflow-hidden rounded-t-xl flex justify-center group-hover:scale-110 transition-transform duration-300">
              <img src={section.img} alt="" className="w-50 h-50 object-contain" />
            </div>
            <div className="flex items-center justify-center mb-4">
              <h2 className="text-xl font-bold text-gray-950 text-center mr-2 transition-colors duration-300">
                {section.title}
              </h2>
            </div>
            <p className="text-base text-gray-950 leading-relaxed text-center transition-colors duration-300">
              {section.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MainSections; 

