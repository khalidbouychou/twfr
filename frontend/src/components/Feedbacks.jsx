import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import reviews from './feedbacks.json';

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
                  <img 
                    src={review.avatar} 
                    alt={review.name} 
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + review.name;
                    }}
                  />
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


