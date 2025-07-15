import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const reviews = [

  {
    name: 'Alexandre Rossetto',
    avatar: '../../public/assets/avatars/1.jpg',
    text: 'Très bon accueil, de bons conseils et un suivi régulier. Je recommande.',
  },
  {
    name: 'Pierre-Marc Carmona',
    avatar: '../../public/assets/avatars/2.jpg',
    text: 'Excellente expérience',
  },
  {
    name: 'Mohamed M.',
    avatar: '../../public/assets/avatars/mediumavatar.jpg',
    text: "Tout s'est bien passé, équipe compétente. Je recommande sans hésitation.",
  },
  {
    name: 'Mohamed M.',
    avatar: '../../public/assets/avatars/3.jpg',
    text: "Tout s'est bien passé, équipe compétente. Je recommande sans hésitation.",
  },
  {
    name: 'Mohamed M.',
    avatar: '../../public/assets/avatars/1.jpg',
    text: "Tout s'est bien passé, équipe compétente. Je recommande sans hésitation.",
  },
  {
    name: 'Mohamed M.',
    avatar: '../../public/assets/avatars/2.jpg',
    text: "Tout s'est bien passé, équipe compétente. Je recommande sans hésitation.",
  },
  {
    name: 'Mohamed M.',
    avatar: '../../public/assets/avatars/3.jpg',
    text: "Tout s'est bien passé, équipe compétente. Je recommande sans hésitation.",
  },
  {
    name: 'Mohamed M.',
    avatar: '../../public/assets/avatars/2.jpg',
    text: "Tout s'est bien passé, équipe compétente. Je recommande sans hésitation.",
  },
];



const Feedbacks = () => {
  return (
    <div className="w-full   flex flex-col items-center">
      <h2 className="text-4xl font-bold text-center text-white mb-2">Nos clients parlent de nous ... et en bien !</h2>
      <p className="text-lg text-center text-gray-200 mb-8 max-w-3xl">Parce que nos clients en parlent mieux que nous, découvrez pourquoi Philippe, Guillaume, Cynthia et tous les autres ont fait confiance à Nalo pour faire fructifier leur épargne sereinement.</p>
      <div className="w-full max-w-6xl">
        <Swiper
          spaceBetween={32}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {reviews.map((review, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-gray-50 rounded-2xl shadow p-8 flex flex-col justify-between h-72">
                <div className="mb-8 text-lg text-gray-800">{review.text}</div>
                <div className="flex items-center gap-4 mt-auto">
                  <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full border-2 border-white shadow" />
                  <div>
                    {/* <div className="flex items-center gap-1">
                      {googleLogo}
                      {stars}
                    </div> */}
                    <div className="text-sm font-medium text-gray-700 mt-1">{review.name}</div>
                  </div>
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
