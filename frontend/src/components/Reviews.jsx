import React from 'react';

const reviews = [
  {
    avatar: '/assets/avatars/1.jpg',
    name: 'Hector Gibbons',
    role: 'Investisseur particulier',
    rating: 5,
    text: `Blown away by how polished this experience is. Les recommandations sont claires et l’interface est ultra fluide.`,
  },
  {
    avatar: '/assets/avatars/2.jpg',
    name: 'Mark Edwards',
    role: 'Entrepreneur',
    rating: 4,
    text: `Vraiment satisfait des insights. J’ai trouvé des opportunités adaptées à mon profil en quelques minutes.`,
  },
  {
    avatar: '/assets/avatars/3.jpg',
    name: 'Sofia Ramos',
    role: 'Analyste',
    rating: 5,
    text: `Des suggestions pertinentes et un vrai gain de temps. J’aime particulièrement la clarté des explications.`,
  },
  {
    avatar: '/assets/avatars/mediumavatar.jpg',
    name: 'Yassin M.',
    role: 'Étudiant',
    rating: 5,
    text: `Parfait pour démarrer sereinement. Les objectifs et la gestion des risques sont bien expliqués.`,
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
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

const ReviewCard = ({ r }) => (
  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 min-w-[320px] max-w-[360px]">
    <img 
      src={r.avatar} 
      alt={r.name} 
      className="w-10 h-10 rounded-full object-cover mt-1"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + r.name;
      }}
    />
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-white font-semibold leading-tight">{r.name}</div>
          <div className="text-white/60 text-xs">{r.role}</div>
        </div>
        <StarRating rating={r.rating} />
      </div>
      <p className="text-white/80 text-sm mt-2 leading-relaxed">{r.text}</p>
    </div>
  </div>
);

const Reviews = () => {
  // duplicate rows for seamless scroll
  const row = [...reviews, ...reviews];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <style>{`
        @keyframes scroll-x {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scroll-x-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>

      <h3 className="text-center text-2xl md:text-3xl font-bold text-white mb-8">Ce que disent nos utilisateurs</h3>

      {/* Row 1 */}
      <div className="relative overflow-hidden">
        <div
          className="flex w-[200%] gap-6"
          style={{ animation: 'scroll-x 28s linear infinite' }}
        >
          {row.map((r, i) => (
            <ReviewCard r={r} key={`r1-${i}-${r.name}`} />
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div className="h-8" />

      {/* Row 2 (reverse) */}
      <div className="relative overflow-hidden">
        <div
          className="flex w-[200%] gap-6"
          style={{ animation: 'scroll-x-reverse 30s linear infinite' }}
        >
          {row.map((r, i) => (
            <ReviewCard r={r} key={`r2-${i}-${r.name}`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews; 