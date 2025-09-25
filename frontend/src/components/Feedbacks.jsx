import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const reviews = [
  {
    name: 'Ahmed B.',
    avatar: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706721/tawfir-ai/1.jpg',
    text: `Grâce à TawfirAI, j'ai pu comprendre où investir mon argent et optimiser mon épargne.
La simulation m'a permis de mieux cerner mes objectifs financiers et de choisir des produits adaptés à mon profil. C'est une application vraiment intuitive et sécurisée !`,
  },
  {
    name: 'Zineb A.',
    avatar: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706722/tawfir-ai/2.jpg',
    text: `"J'étais un peu sceptique au départ, mais après avoir utilisé TawfirAI, je vois clairement la différence. Les recommandations sont personnalisées, et le parcours est facile à suivre. Je me sens plus confiante dans mes choix financiers."`,
  },
  {
    name: 'Mohamed M.',
    avatar: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706723/tawfir-ai/mediumavatar.jpg',
    text: "Tout s'est bien passé, équipe compétente. Je recommande sans hésitation.",
  },
  {
    name: 'Fatima K.',
    avatar: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706722/tawfir-ai/3.jpg',
    text: `"J'ai toujours eu peur des investissements, mais l'interface simple et les explications claires de TawfirAI m'ont donné confiance. Je recommande cette application à tous ceux qui veulent se lancer dans l'épargne et l'investissement sans stress."`,
  },
  {
    name: 'Youssef M.',
    avatar: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706721/tawfir-ai/1.jpg',
    text: `"En tant qu'entrepreneur, il est difficile de trouver le temps pour gérer mes finances. TawfirAI m'a permis de faire des choix intelligents sans y passer des heures. La fonctionnalité de suivi en temps réel est un vrai plus."`,
  },
  {
    name: 'Khalid T.',
    avatar: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706722/tawfir-ai/2.jpg',
    text: `"Les conseils de TawfirAI sont top ! J'ai pu diversifier mon portefeuille en fonction de mes objectifs à long terme. Le tout, avec une sécurité maximale grâce à l'authentification biométrique. Un service vraiment complet."`,
  },
  {
    name: 'Samira L.',
    avatar: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706722/tawfir-ai/3.jpg',
    text: `"Je n'avais jamais investi auparavant, mais TawfirAI m'a guidée à chaque étape. L'application est facile à utiliser et j'ai enfin commencé à voir mes investissements croître."`,
  },
  {
    name: 'Rachid B.',
    avatar: 'https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706722/tawfir-ai/2.jpg',
    text: `"TawfirAI m'a permis d'optimiser mon épargne retraite. J'apprécie la personnalisation des recommandations et le suivi automatique de mes investissements."`,
  },
];




const Feedbacks = () => {
  return (
    <div className="flex flex-col items-center bg-white p-20 rounded-4xl"  >
      <h2 className="text-4xl font-bold text-center mb-2">Ils témoignent de leur expérience</h2>
      <p className="text-lg text-center text-black mb-8 max-w-3xl">Comme eux, n'attendez plus pour réaliser vos projets.</p>
      <div className="w-full   ">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          
        >
          {reviews.map((review, idx) => (
            <SwiperSlide key={idx} className="h-full" >
              <div className="flex flex-col justify-between h-full bg-[#11111a] rounded-xl p-6">
                <div className="text-white text-lg mb-4">
                  {review.text}
                </div>
                <div className="flex items-center gap-2 rounded-md px-4 py-2">
                  <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full" />
                  <span className="text-white font-semibold">{review.name}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Feedbacks;


