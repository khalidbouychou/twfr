import React, { useState, useMemo } from 'react';
import { RecommendationEngine, ROICalculator } from '../Algo';
import { useUserContext } from '../Context/useUserContext';

const QUESTION_CATEGORIES = [
  {
    key: 'sociodemographic',
    title: 'Profil Sociodémographique',
    image: '/assets/avatars/mediumavatar.jpg',
    questions: [
      { key: 'gender', label: 'Mr / Mme ?', type: 'radio', options: ['Mme', 'Mr'] },
      { key: 'age', label: 'Quel âge avez-vous ?', type: 'select', options: ['0-18', '19-59', '60+'] },
      { key: 'familyStatus', label: 'Quelle est votre situation familiale ?', type: 'radio', options: ['Célibataire', 'En couple', 'Avec enfant(s)'] },
      { key: 'residence', label: 'Où résidez-vous ?', type: 'radio', options: ['Urbaine', 'Périurbaine', 'Rurale'] },
      { key: 'educationLevel', label: "Quel est votre niveau d'études ?", type: 'radio', options: ['Primaire', 'Secondaire', 'Supérieur', 'Formation Pro'] },
    ],
  },
  {
    key: 'behavior',
    title: 'Comportement Financier & Objectifs',
    image: '/assets/saving.svg',
    questions: [
      { key: 'savingsGoals', label: "Quels sont vos principaux objectifs d'épargne ?", type: 'checkbox', options: ['Voyage', 'Retraite', 'Acquisition', 'Projets individuels', 'Fonds de sécurité', 'Immobilier'] },
      { key: 'savingsDuration', label: "Quelle est la durée de vos objectifs d'épargne ?", type: 'radio', options: ['Court terme', 'Moyen terme', 'Long terme'] },
      { key: 'savingsFrequency', label: "À quelle fréquence épargnez-vous ?", type: 'select', options: ['Jamais', 'Occasionnelle', 'Mensuelle', 'Automatique'] },
    ],
  },
  {
    key: 'financial',
    title: 'Profil Financier',
    image: '/assets/deposit.svg',
    questions: [
      { key: 'incomeRange', label: 'Sélectionnez votre tranche de revenus', type: 'select', options: ['Moins de 3000 Dhs', '3000 - 6000 Dhs', 'Plus de 6000 Dhs'] },
      { key: 'recurringExpenses', label: 'Dépenses récurrentes mensuelles (MAD)', type: 'number' },
      { key: 'expensesPercentage', label: 'Pourcentage des dépenses récurrentes', type: 'radio', options: ['Faible (moins de 30%)', 'Modéré (30-45%)', 'Élevé (plus de 45%)'] },
    ],
  },
  {
    key: 'experience',
    title: "Expérience d'Investissement & Tolérance au Risque",
    image: '/assets/marketstock.png',
    questions: [
      { key: 'investmentExperience', label: "Quelle est votre expérience d'investissement ?", type: 'checkbox', options: ['Cryptomonnaies', 'Actions', 'Obligations', 'Immobilier', 'Aucun'] },
      { key: 'lossReaction', label: 'Si votre investissement perd 10%, que faites-vous ?', type: 'radio', options: ['Vendre tout', 'Attendre', 'Investir davantage'] },
      { key: 'marketCrashReaction', label: 'Le marché chute de 10% en une semaine. Que faites-vous ?', type: 'radio', options: ["Je vends tout", "J'attends de voir", "J'investis davantage"] },
      { key: 'investmentBasis', label: "Sur quoi basez-vous vos décisions d'investissement ?", type: 'radio', options: ["Mon intuition", "L'avis d'un proche ou expert", 'Des analyses fiables'] },
    ],
  },
  {
    key: 'esg',
    title: 'Préférences ESG',
    image: '/assets/products.svg',
    questions: [
      { key: 'environmentalImpact', label: 'Importance de l\'impact environnemental', type: 'radio', options: ['Pas du tout important', 'Assez important', 'Très important'] },
      { key: 'inclusionPolicies', label: 
        "Importance des politiques d'inclusion et d'équité",
        type: 'radio', options: ['Pas du tout important', 'Assez important', 'Très important'] },
    ],
  },
];

const initialForm = {
  gender: '',
  age: '',
  familyStatus: '',
  residence: '',
  educationLevel: '',
  savingsGoals: [],
  savingsDuration: '',
  savingsFrequency: '',
  incomeRange: '',
  recurringExpenses: '',
  expensesPercentage: '',
  investmentExperience: [],
  lossReaction: '',
  marketCrashReaction: '',
  investmentBasis: '',
  environmentalImpact: '',
  inclusionPolicies: '',
};

const FinancialProfilingStepper = () => {
  const { updateUserProfile, updateUserResults } = useUserContext();
  const [formData, setFormData] = useState(initialForm);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const engine = useMemo(() => new RecommendationEngine(), []);

  const currentCategory = QUESTION_CATEGORIES[categoryIndex];
  const currentQuestion = currentCategory.questions[questionIndex];

  const isAnswerProvided = () => {
    const key = currentQuestion.key;
    const value = formData[key];
    if (currentQuestion.type === 'checkbox') return Array.isArray(value) && value.length > 0;
    if (currentQuestion.type === 'number') return String(value).trim() !== '';
    return Boolean(value);
  };

  const handleAnswer = (value) => {
    const key = currentQuestion.key;
    setFormData((prev) => {
      if (currentQuestion.type === 'checkbox') {
        const set = new Set(prev[key]);
        if (set.has(value)) set.delete(value); else set.add(value);
        return { ...prev, [key]: Array.from(set) };
      }
      return { ...prev, [key]: value };
    });
  };

  const next = () => {
    if (!isAnswerProvided()) return;
    if (questionIndex < currentCategory.questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else if (categoryIndex < QUESTION_CATEGORIES.length - 1) {
      setCategoryIndex(categoryIndex + 1);
      setQuestionIndex(0);
    } else {
      setShowSummary(true);
      const results = engine.generateCompleteRecommendation(transformForm(formData));
      updateUserProfile(transformForm(formData));
      updateUserResults(results);
      setRecommendations(results);
      
      // Store recommendations in localStorage
      localStorage.setItem('userResults', JSON.stringify(results));
      // localStorage.setItem('userProfileData', JSON.stringify(transformForm(formData)));
    }
  };

  const prev = () => {
    if (showSummary) { setShowSummary(false); return; }
    if (questionIndex > 0) setQuestionIndex(questionIndex - 1);
    else if (categoryIndex > 0) {
      const prevCat = QUESTION_CATEGORIES[categoryIndex - 1];
      setCategoryIndex(categoryIndex - 1);
      setQuestionIndex(prevCat.questions.length - 1);
    }
  };

  const transformForm = (data) => ({
    ...data,
    savingsDuration: [
      data.savingsDuration.includes('Court') ? 'Court terme' : '',
      data.savingsDuration.includes('Moyen') ? 'Moyen terme' : '',
      data.savingsDuration.includes('Long') ? 'Long terme' : '',
    ].filter(Boolean),
  });

  // Calculate total progress
  const totalQuestions = QUESTION_CATEGORIES.reduce((sum, cat) => sum + cat.questions.length, 0);
  const currentQuestionNumber = QUESTION_CATEGORIES.slice(0, categoryIndex).reduce((sum, cat) => sum + cat.questions.length, 0) + questionIndex + 1;
  const progressPercentage = (currentQuestionNumber / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl  overflow-hidden">
          {/* Card Header */}
          <div className="bg-[#89559F] px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {showSummary ? 'Profil Completé !' : currentCategory.title}
                </h2>
                {!showSummary && (
                  <p className="text-white/90 mt-1">
                    Question {currentQuestionNumber} sur {totalQuestions}
                  </p>
                )}
              </div>
              {!showSummary && (
                <div className="text-right">
                  <div className="text-white/90 text-sm mb-2">Progression</div>
                  <div className="w-32 bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-white/90 text-sm mt-1">{Math.round(progressPercentage)}%</div>
                </div>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8">
            {!showSummary ? (
              <div className="space-y-6">
                {/* Question */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    {currentQuestion.label}
                  </h3>
                  {currentQuestion.type === 'number' && (
                    <p className="text-gray-600 text-lg">
                      Placer de l'argent régulièrement pourrait faire une grande différence dans quelques années.
                    </p>
                  )}
                </div>

                {/* Answer Options */}
                <div className="max-w-2xl mx-auto">
                  {currentQuestion.type === 'radio' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentQuestion.options.map((opt) => (
                        <label key={opt} className={`p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                          formData[currentQuestion.key] === opt 
                            ? 'border-[#3CD4AB] bg-[#3CD4AB]/10 shadow-lg' 
                            : 'border-gray-200 bg-gray-50 hover:border-[#89559F]/30 hover:bg-gray-100'
                        }`}>
                          <input type="radio" name={currentQuestion.key} className="hidden" onChange={() => handleAnswer(opt)} checked={formData[currentQuestion.key] === opt} />
                          <span className="text-gray-800 font-medium text-center block">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === 'checkbox' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentQuestion.options.map((opt) => {
                        const selected = (formData[currentQuestion.key] || []).includes(opt);
                        return (
                          <label key={opt} className={`p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                            selected 
                              ? 'border-[#3CD4AB] bg-[#3CD4AB]/10 shadow-lg' 
                              : 'border-gray-200 bg-gray-50 hover:border-[#89559F]/30 hover:bg-gray-100'
                          }`}>
                            <input type="checkbox" className="hidden" onChange={() => handleAnswer(opt)} checked={selected} />
                            <span className="text-gray-800 font-medium text-center block">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {currentQuestion.type === 'select' && (
                    <div className="max-w-md mx-auto">
                      <select 
                        value={formData[currentQuestion.key]} 
                        onChange={(e) => handleAnswer(e.target.value)} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white text-gray-800 text-center text-lg focus:border-[#3CD4AB] focus:outline-none transition-colors"
                      >
                        <option value="">Sélectionnez une option</option>
                        {currentQuestion.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {currentQuestion.type === 'number' && (
                    <div className="max-w-md mx-auto">
                      <input 
                        type="number" 
                        value={formData[currentQuestion.key]} 
                        onChange={(e) => handleAnswer(e.target.value)} 
                        className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white text-gray-800 text-center text-2xl font-semibold focus:border-[#3CD4AB] focus:outline-none transition-colors" 
                        placeholder="0"
                      />
                      <p className="text-gray-500 text-center mt-2">Montant en MAD</p>
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="max-w-2xl mx-auto mt-8">
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#3CD4AB] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-gray-700">
                        <p className="font-medium mb-1">Conseil personnalisé</p>
                        <p className="text-sm text-gray-600">
                          Vos réponses nous aident à créer un profil financier adapté à vos besoins et objectifs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Summary Section */
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-[#3CD4AB] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Profil Completé avec Succès !</h3>
                  <p className="text-gray-600">Votre profil financier a été analysé et vos recommandations sont prêtes.</p>
                </div>

                {recommendations && (
                  <>
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">Résumé de votre profil</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Âge:</span>
                          <span className="font-medium text-gray-800">{formData.age}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Revenus:</span>
                          <span className="font-medium text-gray-800">{formData.incomeRange}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Objectifs:</span>
                          <span className="font-medium text-gray-800">{formData.savingsGoals.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Profil de risque:</span>
                          <span className="font-medium text-gray-800">{recommendations.riskProfile.riskLevel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="text-xl font-semibold text-gray-800 mb-4">Produits recommandés avec ROI</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {recommendations.matchedProducts.map((p, idx) => {
                          // Calculate ROI for different time periods
                          const investmentAmount = 10000; // Example investment amount
                          const roi1Year = ROICalculator.calculateSimpleROI(investmentAmount, p.roi_annuel !== undefined ? p.roi_annuel : 5, 1);
                          const roi3Years = ROICalculator.calculateSimpleROI(investmentAmount, p.roi_annuel !== undefined ? p.roi_annuel : 5, 3);
                          const roi5Years = ROICalculator.calculateSimpleROI(investmentAmount, p.roi_annuel !== undefined ? p.roi_annuel : 5, 5);
                          
                          return (
                            <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                              <div className="flex items-center mb-3">
                                <img src={p.avatar} alt={p.nom_produit} className="w-10 h-10 rounded-lg mr-3" />
                                <div>
                                  <div className="font-semibold text-gray-800">{p.nom_produit}</div>
                                  <div className="text-sm text-gray-500">Compatibilité: {Math.round(p.overallCompatibility)}%</div>
                                </div>
                              </div>
                              
                              {/* ROI Information */}
                              <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                                <div className="text-sm font-medium text-blue-800 mb-2">ROI sur 10,000 Dhs</div>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div className="text-center">
                                    <div className="font-semibold text-green-600">{ROICalculator.formatROI(roi1Year.roiPercentage)}</div>
                                    <div className="text-gray-500">1 an</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-blue-600">{ROICalculator.formatROI(roi3Years.roiPercentage)}</div>
                                    <div className="text-gray-500">3 ans</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-purple-600">{ROICalculator.formatROI(roi5Years.roiPercentage)}</div>
                                    <div className="text-gray-500">5 ans</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Durée: {p.duree_recommandee}</span>
                                <span>Risque: {p.risque}/7</span>
                              </div>
                              
                              {/* Additional ROI Details */}
                              <div className="text-xs text-gray-500 space-y-1">
                                <div className="flex justify-between">
                                  <span>ROI annuel:</span>
                                  <span className={`font-medium ${ROICalculator.getROIColor(p.roi_annuel !== undefined ? p.roi_annuel : 5)}`}>
                                    {p.roi_annuel !== undefined ? p.roi_annuel : 5}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Volatilité:</span>
                                  <span>{p.volatilite !== undefined ? p.volatilite : 'N/A'}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Frais annuels:</span>
                                  <span>{p.frais_annuels !== undefined ? p.frais_annuels : 'N/A'}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4 max-w-4xl mx-auto">
          <button 
            onClick={prev} 
            disabled={categoryIndex === 0 && questionIndex === 0 && !showSummary} 
            className={`px-8 py-4 rounded-xl font-medium transition-all duration-200 ${
              (categoryIndex === 0 && questionIndex === 0 && !showSummary) 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ← Précédent
          </button>
          
          {!showSummary ? (
            <button 
              onClick={next} 
              disabled={!isAnswerProvided()} 
              className={`px-8 py-4 rounded-xl font-medium transition-all duration-200 ${
                isAnswerProvided() 
                  ? 'bg-[#3CD4AB] text-white hover:bg-[#2bb894] shadow-lg hover:shadow-xl' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Suivant →
            </button>
          ) : (
            <a 
              href="/dashboard" 
              className="px-8 py-4 rounded-xl font-medium bg-[#3CD4AB] text-white hover:bg-[#2bb894] shadow-lg hover:shadow-xl transition-all duration-200 text-center"
            >
              Aller au Dashboard →
            </a>
          )}
        </div>
      </div>
    </div>
  );
} 
export default FinancialProfilingStepper;