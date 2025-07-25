import React, { useState } from 'react';
import Cat1 from './cat1';
import Cat2 from './cat2';
import Cat3 from './cat3';
import Cat4 from './cat4';
import Cat5 from './cat5';

// SVG icons for each category (simple inline SVGs for demo)
const icons = [
  // User (Connaissance Client)
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  // Piggy bank (Profil Épargnant)
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 11-14 0 7 7 0 0114 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M17 11V9a5 5 0 00-10 0v2" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 17v2m0 0h-2m2 0h2" /></svg>,
  // Chart (Profil Financier)
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 010 7.75" /></svg>,
  // Briefcase (Profil Investisseur)
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" /></svg>,
  // Leaf (Sensibilités ESG)
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 21c0-4.418 7-8 7-8s7 3.582 7 8" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v8" /></svg>,
];

const categories = [
  { label: 'Connaissance Client', component: <Cat1 /> },
  { label: 'Profil Épargnant', component: <Cat2 /> },
  { label: 'Profil Financier', component: <Cat3 /> },
  { label: 'Profil Investisseur', component: <Cat4 /> },
  { label: 'Sensibilités ESG', component: <Cat5 /> },
];

const activeColor = 'bg-[#3CD4AB] text-white border-[#3CD4AB]';
const completedColor = 'bg-[#3CD4AB]/10 text-[#3CD4AB] border-[#3CD4AB]';
const defaultColor = 'bg-white text-gray-400 border-gray-300';

const SimulationStepper = () => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="w-full max-w-3xl mx-auto p-2 sm:p-4 mt-6 sm:mt-12">
      {/* Stepper */}
      <div className="flex items-center justify-between w-full overflow-x-auto pb-4">
        {categories.map((cat, idx) => (
          <React.Fragment key={cat.label}>
            <div className="flex flex-col items-center min-w-[70px]">
              <button
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold text-base transition-colors focus:outline-none
                  ${idx === current ? activeColor : idx < current ? completedColor : defaultColor}
                `}
                onClick={() => setCurrent(idx)}
                disabled={idx > current}
                aria-current={idx === current ? 'step' : undefined}
              >
                {idx + 1}
              </button>
              <div className={`mt-2 ${idx === current ? 'text-[#3CD4AB]' : 'text-gray-400'} flex flex-col items-center`}>
                {icons[idx]}
                <span className="text-xs sm:text-sm font-medium mt-1 text-center whitespace-nowrap">
                  {cat.label}
                </span>
              </div>
            </div>
            {/* Connector line except after last step */}
            {idx < categories.length - 1 && (
              <div className="flex-1 h-1 mx-1 sm:mx-2 relative">
                <div className={`absolute top-1/2 left-0 w-full h-1 rounded-full ${idx < current ? 'bg-[#3CD4AB]' : 'bg-gray-200'}`}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Current Category Component */}
      <div className="mt-6 sm:mt-8 bg-white dark:bg-[#181828] rounded shadow p-2 sm:p-6 min-h-[120px] sm:min-h-[200px]">
        {categories[current].component}
      </div>
      {/* Navigation Buttons */}
      <div className="flex justify-center gap-100 mt-6">
        <button
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setCurrent((prev) => prev - 1)}
          disabled={current === 0}
        >
          Précédent
        </button>
        <button
          className="px-4 py-2 rounded bg-[#3CD4AB] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setCurrent((prev) => prev + 1)}
          disabled={current === categories.length - 1}
        >
          {current === categories.length - 1 ? 'Terminer' : 'Suivant'}
        </button>
      </div>
    </div>
  );
};

export default SimulationStepper; 