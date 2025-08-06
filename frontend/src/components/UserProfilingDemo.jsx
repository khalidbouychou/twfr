import React from 'react';
import { FinancialProfilingStepper } from './Profiling';

const UserProfilingDemo = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Découvrez votre profil financier
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Testez notre questionnaire de profilage financier pour comprendre vos objectifs 
            et votre tolérance au risque.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <FinancialProfilingStepper />
        </div>
      </div>
    </section>
  );
};

export default UserProfilingDemo; 