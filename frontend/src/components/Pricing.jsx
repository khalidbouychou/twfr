import React from 'react';

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-primary-bg text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">Tarification</h2>
        <p className="text-lg mb-8">Découvrez nos plans d'abonnement simples et transparents pour vous aider à atteindre vos objectifs financiers.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="p-6 bg-secondary text-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Gratuit</h3>
            <p>Accédez à toutes les fonctionnalités de base sans frais. Idéal pour les débutants en épargne.</p>
          </div>
          <div className="p-6 bg-secondary text-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Premium</h3>
            <p>Des fonctionnalités avancées, des recommandations personnalisées et un suivi détaillé de vos investissements.</p>
          </div>
          <div className="p-6 bg-secondary text-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Entreprise</h3>
            <p>Des solutions d'épargne et d'investissement personnalisées pour les entreprises et les professionnels.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
