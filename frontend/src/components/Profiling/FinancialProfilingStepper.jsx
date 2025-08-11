import React, { useState, useMemo } from 'react';
import { RecommendationEngine } from '../Algo';
import { useUserContext } from '../Context/UserContext';

const QUESTION_CATEGORIES = [
  {
    key: 'sociodemographic',
    title: 'Profil Sociodémographique',
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
    questions: [
      { key: 'savingsGoals', label: "Quels sont vos principaux objectifs d'épargne ?", type: 'checkbox', options: ['Voyage', 'Retraite', 'Acquisition', 'Projets individuels', 'Fonds de sécurité', 'Immobilier'] },
      { key: 'savingsDuration', label: "Quelle est la durée de vos objectifs d'épargne ?", type: 'radio', options: ['Court terme', 'Moyen terme', 'Long terme'] },
      { key: 'savingsFrequency', label: "À quelle fréquence épargnez-vous ?", type: 'select', options: ['Jamais', 'Occasionnelle', 'Mensuelle', 'Automatique'] },
    ],
  },
  {
    key: 'financial',
    title: 'Profil Financier',
    questions: [
      { key: 'incomeRange', label: 'Sélectionnez votre tranche de revenus', type: 'select', options: ['Moins de 3000 Dhs', '3000 - 6000 Dhs', 'Plus de 6000 Dhs'] },
      { key: 'recurringExpenses', label: 'Dépenses récurrentes mensuelles (MAD)', type: 'number' },
      { key: 'expensesPercentage', label: 'Pourcentage des dépenses récurrentes', type: 'radio', options: ['Faible (moins de 30%)', 'Modéré (30-45%)', 'Élevé (plus de 45%)'] },
    ],
  },
  {
    key: 'experience',
    title: "Expérience d'Investissement & Tolérance au Risque",
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
    questions: [
      { key: 'environmentalImpact', label: 'Importance de l’impact environnemental', type: 'radio', options: ['Pas du tout important', 'Assez important', 'Très important'] },
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

export default function FinancialProfilingStepper() {
  const { updateUserProfile, updateUserResults, queuePendingInvestment } = useUserContext();
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

  const handleInvestFromResults = (product) => {
    queuePendingInvestment({ product, amount: product.min || undefined });
    window.location.href = '/dashboard';
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#0F0F19] rounded-lg border border-[#89559F]/30">
      <div className="mb-6">
        <div className="text-white/70 text-sm mb-1">{currentCategory.title}</div>
        <div className="text-2xl font-bold text-white">
          {showSummary ? 'Confirmation & Produits recommandés' : currentQuestion.label}
        </div>
      </div>

      {!showSummary && (
        <div className="space-y-4">
          {currentQuestion.type === 'radio' && (
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((opt) => (
                <label key={opt} className={`p-3 rounded-lg cursor-pointer border ${formData[currentQuestion.key] === opt ? 'border-[#3CD4AB] bg-[#3CD4AB]/10' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}>
                  <input type="radio" name={currentQuestion.key} className="hidden" onChange={() => handleAnswer(opt)} checked={formData[currentQuestion.key] === opt} />
                  <span className="text-white">{opt}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'checkbox' && (
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((opt) => {
                const selected = (formData[currentQuestion.key] || []).includes(opt);
                return (
                  <label key={opt} className={`p-3 rounded-lg cursor-pointer border ${selected ? 'border-[#3CD4AB] bg-[#3CD4AB]/10' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}>
                    <input type="checkbox" className="hidden" onChange={() => handleAnswer(opt)} checked={selected} />
                    <span className="text-white">{opt}</span>
                  </label>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'select' && (
            <select value={formData[currentQuestion.key]} onChange={(e)=>handleAnswer(e.target.value)} className="w-full p-3 border border-[#89559F] rounded-lg bg-[#0F0F19] text-white">
              <option value="">Sélectionnez</option>
              {currentQuestion.options.map((opt) => (
                <option key={opt} value={opt} style={{ backgroundColor: '#0F0F19', color: 'white' }}>{opt}</option>
              ))}
            </select>
          )}

          {currentQuestion.type === 'number' && (
            <input type="number" value={formData[currentQuestion.key]} onChange={(e)=>handleAnswer(e.target.value)} className="w-full p-3 border border-[#89559F] rounded-lg bg-[#0F0F19] text-white" placeholder="0" />
          )}
        </div>
      )}

      {showSummary && recommendations && (
        <div className="space-y-6">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-white mb-3">Résumé</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-white/80">
              <div><b className="text-white/90">Âge:</b> {formData.age}</div>
              <div><b className="text-white/90">Revenus:</b> {formData.incomeRange}</div>
              <div><b className="text-white/90">Objectifs:</b> {formData.savingsGoals.join(', ')}</div>
              <div><b className="text-white/90">Risque:</b> {recommendations.riskProfile.riskLevel}</div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-white mb-3">Produits recommandés</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.matchedProducts.slice(0,6).map((p, idx) => (
                <div key={idx} className="p-4 border border-white/10 rounded-lg bg-white/5">
                  <div className="flex items-center mb-3">
                    <img src={p.avatar} alt={p.nom_produit} className="w-12 h-12 rounded mr-3" />
                    <div>
                      <div className="text-white font-semibold">{p.nom_produit}</div>
                      <div className="text-white/60 text-xs">Compatibilité: {Math.round(p.overallCompatibility)}%</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-white/80 mb-3">
                    <span>Durée: {p.duree_recommandee}</span>
                    <span>Risque: {p.risque}/7</span>
                  </div>
                  <div className="text-right text-white/60 text-xs">Complétez le profil pour investir depuis le tableau de bord</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button onClick={prev} disabled={categoryIndex===0 && questionIndex===0 && !showSummary} className={`px-6 py-2 rounded-lg transition-all ${ (categoryIndex===0 && questionIndex===0 && !showSummary) ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-[#89559F] text-white hover:bg-[#7a4a8a]' }`}>
          Précédent
        </button>
        {!showSummary ? (
          <button onClick={next} disabled={!isAnswerProvided()} className={`px-6 py-2 rounded-lg transition-all ${ isAnswerProvided() ? 'bg-[#3CD4AB] text-[#0F0F19] hover:bg-[#2bb894]' : 'bg-gray-600 text-gray-400 cursor-not-allowed' }`}>
            Suivant
          </button>
        ) : (
          <a href="/dashboard" className="px-6 py-2 rounded-lg bg-[#3CD4AB] text-[#0F0F19] hover:bg-[#2bb894] font-semibold">Aller au Dashboard</a>
        )}
      </div>
    </div>
  );
} 