import React, { useState } from 'react';
import DrivenInvestmentRecommendations from './DrivenInvestmentRecommendations';

const DrivenRecommendationsDemo = () => {
  const [demoData, setDemoData] = useState({
    riskProfile: {
      riskLevel: "Modéré",
      description: "Vous préférez un équilibre entre sécurité et croissance"
    },
    durationProfile: {
      durationPreference: "Moyen terme (3-5 ans)"
    },
    matchedProducts: [
      {
        id: 1,
        nom_produit: "OPCVM Actions Maroc",
        duree_recommandee: "LONG TERME",
        enveloppe_gestion: "Compte Titre/PEA",
        avatar: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop&crop=center",
        roi_annuel: 8.5,
        roi_3_ans: 27.6,
        roi_5_ans: 50.3,
        roi_10_ans: 125.8,
        volatilite: 15.2,
        frais_annuels: 1.5,
        risque: "5",
        overallCompatibility: 87,
        type: "Actions"
      },
      {
        id: 2,
        nom_produit: "OPCVM OMLT",
        duree_recommandee: "MOYEN/LONG TERME",
        enveloppe_gestion: "Compte Titre/Assurance-vie",
        avatar: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=400&fit=crop&crop=center",
        roi_annuel: 6.2,
        roi_3_ans: 19.8,
        roi_5_ans: 35.1,
        roi_10_ans: 82.4,
        volatilite: 8.5,
        frais_annuels: 1.2,
        risque: "3",
        overallCompatibility: 92,
        type: "OPCVM"
      },
      {
        id: 3,
        nom_produit: "Capital Garanti",
        duree_recommandee: "COURT/MOYEN/LONG TERME",
        enveloppe_gestion: "Compte Titre ou PEA",
        avatar: "https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?w=400&h=400&fit=crop&crop=center",
        roi_annuel: 4.8,
        roi_3_ans: 15.1,
        roi_5_ans: 26.4,
        roi_10_ans: 59.8,
        volatilite: 1.2,
        frais_annuels: 1.1,
        risque: "2",
        overallCompatibility: 78,
        type: "Garanti"
      },
      {
        id: 4,
        nom_produit: "Depot a termes",
        duree_recommandee: "COURT/MOYEN/LONG TERME",
        enveloppe_gestion: "compte bancaire",
        avatar: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop&crop=center",
        roi_annuel: 4.2,
        roi_3_ans: 13.1,
        roi_5_ans: 22.8,
        roi_10_ans: 51.2,
        volatilite: 0.3,
        frais_annuels: 0.2,
        risque: "1",
        overallCompatibility: 85,
        type: "Épargne"
      }
    ]
  });

  const handleInvestmentDecision = (decision) => {
    console.log('Demo Investment Decision:', decision);
    alert(`Investissement confirmé!\n\nScénario: ${decision.scenario.name}\nMontant: ${decision.totalAmount.toLocaleString()} Dhs\nRendement attendu: +${decision.expectedReturn.toFixed(1)}%`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎯 Démonstration des Recommandations d'Investissement
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez comment notre système de recommandations avancées analyse votre profil 
            et vous propose des investissements personnalisés avec des scénarios multiples.
          </p>
        </div>

        {/* Demo Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            📊 Données de Démonstration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Profil de Risque:</span>
              <div className="text-blue-800">{demoData.riskProfile.riskLevel}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Durée Préférée:</span>
              <div className="text-blue-800">{demoData.durationProfile.durationPreference}</div>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Produits Recommandés:</span>
              <div className="text-blue-800">{demoData.matchedProducts.length} produits</div>
            </div>
          </div>
          <p className="text-blue-700 text-sm mt-3">
            Ces données simulées montrent comment le système fonctionne avec un profil d'investisseur modéré.
          </p>
        </div>

        {/* Driven Investment Recommendations Component */}
        <DrivenInvestmentRecommendations 
          userResults={demoData}
          onInvestmentDecision={handleInvestmentDecision}
        />

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Cette démonstration utilise des données simulées pour illustrer les fonctionnalités.
          </p>
          <p className="text-sm mt-1">
            Dans un environnement réel, ces recommandations seraient basées sur votre profil financier réel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DrivenRecommendationsDemo; 