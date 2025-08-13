import React, { useState, useMemo } from 'react';
import { 
  IoCalculator, 
  IoTrendingUp, 
  IoShieldCheckmark, 
  IoTime,
  IoStar,
  IoInformationCircle,
  IoCheckmarkCircle,
  IoWarning
} from 'react-icons/io5';
import { profileBasedRecommendationEngine } from './ProfileBasedRecommendationEngine';
import { investmentGrowthCalculator } from './InvestmentGrowthCalculator';

const InvestmentSystem = () => {
  // État pour le profil utilisateur
  const [userProfile, setUserProfile] = useState({
    toleranceRisque: 'equilibre',
    dureeInvestissement: 'moyen',
    familleProduit: '',
    rendementAttendu: null
  });

  // État pour le calcul de croissance
  const [investmentParams, setInvestmentParams] = useState({
    montantInitial: 1000,
    produitSelectionne: null,
    periodeMois: 6
  });

  // État pour les résultats
  const [recommendations, setRecommendations] = useState(null);
  const [growthResults, setGrowthResults] = useState(null);
  const [activeTab, setActiveTab] = useState('recommendations');

  // Génération des recommandations
  const generateRecommendations = () => {
    try {
      const results = profileBasedRecommendationEngine.generateRecommendations(userProfile);
      setRecommendations(results);
    } catch (error) {
      console.error('Erreur lors de la génération des recommandations:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // Calcul de la croissance
  const calculateGrowth = () => {
    if (!investmentParams.produitSelectionne) {
      alert('Veuillez sélectionner un produit d\'abord');
      return;
    }

    try {
      const results = investmentGrowthCalculator.calculateFutureValue(
        investmentParams.montantInitial,
        investmentParams.produitSelectionne.rendement_annuel_moyen,
        investmentParams.periodeMois,
        investmentParams.produitSelectionne.famille
      );
      setGrowthResults(results);
    } catch (error) {
      console.error('Erreur lors du calcul de croissance:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // Mise à jour du profil utilisateur
  const updateUserProfile = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Mise à jour des paramètres d'investissement
  const updateInvestmentParams = (field, value) => {
    setInvestmentParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Sélection d'un produit pour le calcul
  const selectProductForCalculation = (product) => {
    setInvestmentParams(prev => ({
      ...prev,
      produitSelectionne: product
    }));
    setActiveTab('growth');
  };

  // Composant pour le profil utilisateur
  const UserProfileForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <IoShieldCheckmark className="mr-2 text-blue-600" />
        Profil d'Investisseur
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tolérance au risque */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tolérance au Risque
          </label>
          <select
            value={userProfile.toleranceRisque}
            onChange={(e) => updateUserProfile('toleranceRisque', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="prudent">Prudent (Risque 1-3)</option>
            <option value="equilibre">Équilibré (Risque 2-5)</option>
            <option value="dynamique">Dynamique (Risque 4-8)</option>
          </select>
        </div>

        {/* Durée d'investissement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durée d'Investissement
          </label>
          <select
            value={userProfile.dureeInvestissement}
            onChange={(e) => updateUserProfile('dureeInvestissement', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="court">Court terme</option>
            <option value="moyen">Moyen terme</option>
            <option value="long terme">Long terme</option>
          </select>
        </div>

        {/* Famille de produit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Famille de Produit (Optionnel)
          </label>
          <select
            value={userProfile.familleProduit}
            onChange={(e) => updateUserProfile('familleProduit', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Aucune préférence</option>
            <option value="actions">Actions</option>
            <option value="obligations">Obligations</option>
            <option value="epargne">Épargne</option>
            <option value="monetaire">Monétaire</option>
            <option value="mixte">Mixte</option>
            <option value="immobilier">Immobilier</option>
            <option value="garanti">Garanti</option>
          </select>
        </div>

        {/* Rendement attendu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rendement Attendu % (Optionnel)
          </label>
          <input
            type="number"
            value={userProfile.rendementAttendu || ''}
            onChange={(e) => updateUserProfile('rendementAttendu', e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="Ex: 5.0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <button
        onClick={generateRecommendations}
        className="mt-4 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Générer les Recommandations
      </button>
    </div>
  );

  // Composant pour les recommandations
  const RecommendationsDisplay = () => {
    if (!recommendations) return null;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <IoStar className="mr-2 text-yellow-600" />
          Recommandations Personnalisées
        </h3>

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Votre Profil</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Risque:</span> {recommendations.userProfile.toleranceRisque}
            </div>
            <div>
              <span className="text-blue-600 font-medium">Durée:</span> {recommendations.userProfile.dureeInvestissement}
            </div>
            <div>
              <span className="text-blue-600 font-medium">Famille:</span> {recommendations.userProfile.familleProduit || 'Aucune préférence'}
            </div>
            <div>
              <span className="text-blue-600 font-medium">Rendement:</span> {recommendations.userProfile.rendementAttendu ? `${recommendations.userProfile.rendementAttendu}%` : 'Aucune attente'}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {recommendations.recommendations.map((product, index) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={product.avatar}
                    alt={product.nom_produit}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{product.nom_produit}</h4>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Risque:</span>
                        <span className="ml-1 font-medium">{product.risque}/8</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Durée:</span>
                        <span className="ml-1 font-medium">{product.duree_recommandee}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Rendement:</span>
                        <span className="ml-1 font-medium text-green-600">{product.rendement_annuel_moyen}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ticket:</span>
                        <span className="ml-1 font-medium">{product.ticket_entree_minimum.toLocaleString()} DH</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {product.compatibilityPercentage}%
                  </div>
                  <div className="text-sm text-gray-500">Compatibilité</div>
                  <button
                    onClick={() => selectProductForCalculation(product)}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Simuler
                  </button>
                </div>
              </div>

              {/* Explications */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h5 className="font-medium text-gray-700 mb-2">Pourquoi ce produit vous convient :</h5>
                <ul className="space-y-1">
                  {product.explanations.slice(0, 3).map((explanation, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <IoCheckmarkCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {explanation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Composant pour le calculateur de croissance
  const GrowthCalculator = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <IoCalculator className="mr-2 text-green-600" />
        Calculateur de Croissance d'Investissement
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Montant initial */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant Initial (DH)
          </label>
          <input
            type="number"
            value={investmentParams.montantInitial}
            onChange={(e) => updateInvestmentParams('montantInitial', parseFloat(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            min="100"
            step="100"
          />
        </div>

        {/* Produit sélectionné */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Produit Sélectionné
          </label>
          {investmentParams.produitSelectionne ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="font-medium text-green-800">{investmentParams.produitSelectionne.nom_produit}</div>
              <div className="text-sm text-green-600">{investmentParams.produitSelectionne.rendement_annuel_moyen}% rendement</div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
              Sélectionnez un produit depuis les recommandations
            </div>
          )}
        </div>

        {/* Période */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Période (mois)
          </label>
          <select
            value={investmentParams.periodeMois}
            onChange={(e) => updateInvestmentParams('periodeMois', parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value={3}>3 mois</option>
            <option value={6}>6 mois</option>
            <option value={12}>1 an</option>
            <option value={24}>2 ans</option>
            <option value={60}>5 ans</option>
          </select>
        </div>
      </div>

      <button
        onClick={calculateGrowth}
        disabled={!investmentParams.produitSelectionne}
        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Calculer la Croissance
      </button>

      {/* Résultats */}
      {growthResults && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-4">Résultats du Calcul</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Résultats principaux */}
            <div>
              <h5 className="font-medium text-gray-700 mb-3">Résultats Principaux</h5>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant initial:</span>
                  <span className="font-medium">{growthResults.montantInitial.toLocaleString()} DH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valeur future:</span>
                  <span className="font-medium text-green-600">{growthResults.valeurFuture.toLocaleString()} DH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gains:</span>
                  <span className="font-medium text-green-600">+{growthResults.gains.toLocaleString()} DH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rendement total:</span>
                  <span className="font-medium text-green-600">+{growthResults.rendementTotal}%</span>
                </div>
              </div>
            </div>

            {/* Scénarios */}
            <div>
              <h5 className="font-medium text-gray-700 mb-3">Scénarios</h5>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Optimiste:</span>
                  <span className="font-medium text-green-600">{growthResults.scenarios.optimiste.valeurFuture.toLocaleString()} DH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Réaliste:</span>
                  <span className="font-medium text-blue-600">{growthResults.scenarios.realiste.valeurFuture.toLocaleString()} DH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pessimiste:</span>
                  <span className="font-medium text-orange-600">{growthResults.scenarios.pessimiste.valeurFuture.toLocaleString()} DH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommandations */}
          {growthResults.recommandations && growthResults.recommandations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <h5 className="font-medium text-gray-700 mb-2">Recommandations</h5>
              <ul className="space-y-1">
                {growthResults.recommandations.map((rec, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600">
                    <IoInformationCircle className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Système d'Investissement Intelligent
        </h1>
        <p className="text-gray-600">
          Recommandations personnalisées et calculs de croissance pour optimiser vos investissements
        </p>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'recommendations'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Recommandations
          </button>
          <button
            onClick={() => setActiveTab('growth')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'growth'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Calculateur de Croissance
          </button>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'recommendations' && (
        <>
          <UserProfileForm />
          <RecommendationsDisplay />
        </>
      )}

      {activeTab === 'growth' && (
        <GrowthCalculator />
      )}

      {/* Informations supplémentaires */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Comment ça fonctionne ?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <IoStar className="mr-2 text-yellow-600" />
              Système de Recommandation
            </h4>
            <p className="text-sm text-gray-600">
              Notre algorithme analyse votre profil d'investisseur (tolérance au risque, durée d'investissement, 
              préférences de produit) pour vous recommander les produits financiers les plus adaptés.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2 flex items-center">
              <IoCalculator className="mr-2 text-green-600" />
              Calculateur de Croissance
            </h4>
            <p className="text-sm text-gray-600">
              Utilisez la formule mathématique pour estimer la valeur future de vos investissements 
              selon le rendement annuel moyen et la période choisie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSystem; 