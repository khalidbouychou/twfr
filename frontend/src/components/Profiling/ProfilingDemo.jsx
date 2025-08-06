import React from 'react';
import FinancialProfilingStepper from './FinancialProfilingStepper';

const ProfilingDemo = () => {
  return (
    <div className="min-h-screen bg-[#0F0F19] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-white mb-4">
            Profil Financier Tawfir
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Complétez ce questionnaire pour nous permettre de vous proposer des solutions d'investissement 
            adaptées à votre profil et à vos objectifs financiers.
          </p>
        </div>

        {/* Stepper Component */}
        <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <FinancialProfilingStepper />
        </div>
        
        {/* Information Section */}
        <div className="mt-12 bg-white/10 rounded-lg shadow-lg p-6 animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold text-white mb-4">
            À propos de ce questionnaire
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#3CD4AB] mb-2">
                Pourquoi ce questionnaire ?
              </h3>
              <p className="text-gray-300">
                Ce questionnaire nous aide à comprendre votre profil financier, vos objectifs 
                et votre tolérance au risque pour vous proposer des solutions d'investissement 
                personnalisées et adaptées à vos besoins.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#3CD4AB] mb-2">
                Vos données sont protégées
              </h3>
              <p className="text-gray-300">
                Toutes les informations que vous nous fournissez sont strictement confidentielles 
                et utilisées uniquement pour améliorer nos recommandations d'investissement.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfilingDemo; 