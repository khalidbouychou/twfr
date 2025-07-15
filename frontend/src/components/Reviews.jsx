import React from 'react';

const reviews = [
  {
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'Hector Gibbons',
    date: 'July 12, 2021',
    rating: 5,
    text: `Blown away by how polished this icon pack is. Everything looks so consistent and each SVG is optimized out of the box so I can use it directly with confidence. It would take me several hours to create a single icon this good, so it's a steal at this price.`,
  },
  {
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    name: 'Mark Edwards',
    date: 'July 6, 2021',
    rating: 4,
    text: `Really happy with look and options of these icons. I've found uses for them everywhere in my recent projects. I hope there will be 20px versions in the future!`,
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center mb-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-6 h-6 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill={i <= rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29a1 1 0 00.95.69h6.631c.969 0 1.371 1.24.588 1.81l-5.37 3.905a1 1 0 00-.364 1.118l2.036 6.29c.3.921-.755 1.688-1.54 1.118l-5.37-3.905a1 1 0 00-1.175 0l-5.37 3.905c-.784.57-1.838-.197-1.54-1.118l2.036-6.29a1 1 0 00-.364-1.118L2.342 11.717c-.783-.57-.38-1.81.588-1.81h6.631a1 1 0 00.95-.69l2.036-6.29z"
          />
        </svg>
      ))}
    </div>
  );
}

const Reviews = () => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {reviews.map((review, idx) => (
        <div key={review.name} className="flex items-start gap-4 mb-10">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-12 h-12 rounded-full object-cover mt-1"
          />
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <span className="font-bold text-gray-900">{review.name}</span>
              <span className="text-gray-500 text-sm">{review.date}</span>
            </div>
            <StarRating rating={review.rating} />
            <p className="text-gray-700 leading-relaxed mb-2">{review.text}</p>
            {idx !== reviews.length - 1 && (
              <hr className="my-8 border-gray-200" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews; 