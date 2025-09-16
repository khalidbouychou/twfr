import React, { useState, useMemo } from 'react';
import { RecommendationEngine } from '../Algo'; // Adjust the import path as needed
import { useUserContext } from '../Context/useUserContext';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

// DATA (Constants)
const QUESTION_CATEGORIES = [
  {
    key: 'connaissance_client',
    title: 'Connaissance Client',
    questions: [
      { key: 'gender', label: 'Quel est votre sexe ?', type: 'radio', options: ['Homme', 'Femme'] },
      { key: 'age', label: 'Quel est votre âge ?', type: 'select', options: ['18-25', '26-35', '36-45', '46-55', '56-65', '66+'] },
      { key: 'familyStatus', label: 'Quelle est votre situation familiale ?', type: 'radio', options: ['Célibataire', 'Marié', 'Avec enfant(s)'] },
      { key: 'residence', label: 'Où résidez-vous ?', type: 'radio', options: ['Urbaine', 'Périurbaine', 'Rurale'] },
      { key: 'educationLevel', label: "Quel est votre niveau d'études ?", type: 'select', options: ['Primaire', 'Secondaire', 'Supérieur', 'Formation Pro'] },
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
      { key: 'incomeRange', label: 'Sélectionnez votre tranche de revenus', type: 'select', options: ['Moins de 3000 MAD', '3000 - 6000 MAD', 'Plus de 6000 MAD'] },
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
      { key: 'environmentalImpact', label: 'Importance de l\'impact environnemental', type: 'radio', options: ['Pas du tout important', 'Assez important', 'Très important'] },
      { key: 'inclusionPolicies', label: "Importance des politiques d'inclusion et d'équité", type: 'radio', options: ['Pas du tout important', 'Assez important', 'Très important'] },
    ],
  },
];

const initialForm = Object.fromEntries(
  QUESTION_CATEGORIES.flatMap(cat => cat.questions).map(q => [q.key, q.type === 'checkbox' ? [] : ''])
);

// Reusable Button Component for navigation using Shadcn
const ActionButton = ({ onClick, disabled, children, primary = false }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    variant={primary ? "default" : "secondary"}
    size="lg"
    className={`w-32 transition-all duration-300 transform hover:scale-105 ${
      primary
        ? 'bg-[#89559F] hover:bg-[#89559F]/90 text-white shadow-lg'
        : 'bg-gray-800 hover:bg-gray-700 text-white'
    }`}
  >
    {children}
  </Button>
);


const FinancialProfilingStepper = () => {
  const { updateUserProfile, updateUserResults } = useUserContext();
  const [formData, setFormData] = useState(initialForm);
  const [currentStep, setCurrentStep] = useState(0); // Index of category
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index of question in category
  const [recommendations, setRecommendations] = useState(null);
  
  const engine = useMemo(() => new RecommendationEngine(), []);

  const totalSteps = QUESTION_CATEGORIES.length;
  const isFinalStep = currentStep >= totalSteps;

  const currentCategory = QUESTION_CATEGORIES[currentStep];
  const currentQuestion = currentCategory?.questions[currentQuestionIndex];

  // Validation Check
  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion) return false;
    const value = formData[currentQuestion.key];
    return Array.isArray(value) ? value.length > 0 : String(value).trim() !== '';
  };

  const isStepComplete = (stepIndex) => {
    return QUESTION_CATEGORIES[stepIndex]?.questions.every(q => {
        const value = formData[q.key];
        return Array.isArray(value) ? value.length > 0 : Boolean(value);
    }) ?? false;
  };
  
  // Handlers
  const handleAnswer = (value) => {
    if (!currentQuestion) return;
    const key = currentQuestion.key;
    const type = currentQuestion.type;
    
    setFormData(prev => {
      if (type === 'checkbox') {
        const currentValues = new Set(prev[key]);
        if (currentValues.has(value)) {
          currentValues.delete(value);
        } else {
          currentValues.add(value);
        }
        return { ...prev, [key]: Array.from(currentValues) };
      }
      return { ...prev, [key]: value };
    });
  };

  const nextQuestion = () => {
    if (!isCurrentQuestionAnswered()) return;

    if (currentQuestionIndex < currentCategory.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        // Last question of last step, generate results
        const transformedData = { ...formData }; // Apply any final data transformations if needed
        const results = engine.generateCompleteRecommendation(transformedData);
        updateUserProfile(transformedData);
        updateUserResults(results);
        setRecommendations(results);
        localStorage.setItem('userResults', JSON.stringify(results));
        setCurrentStep(prev => prev + 1); // Move to the results view
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentStep > 0) {
      const prevCategory = QUESTION_CATEGORIES[currentStep - 1];
      setCurrentStep(prev => prev - 1);
      setCurrentQuestionIndex(prevCategory.questions.length - 1);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#0F0F19] text-white flex flex-col items-center justify-center  p-4 overflow-y-auto"
    >
      <div className="w-full max-w-4xl my-auto">
        {/* Stepper Navigation */}
        <div className="flex justify-center items-center mb-5 space-x-2 md:space-x-4">
          {QUESTION_CATEGORIES.map((category, index) => {
            const isActive = currentStep === index;
            const isCompleted = isStepComplete(index);
            return (
              <React.Fragment key={category.key}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    isCompleted ? 'bg-[#3CD4AB]' : isActive ? 'bg-[#89559F]' : 'bg-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`ml-3 font-medium hidden md:block ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {category.title}
                  </span>
                </div>
                {index < totalSteps - 1 && <div className="flex-1 h-0.5 bg-gray-700"></div>}
              </React.Fragment>
            );
          })}
        </div>

        {/* Main Content Card */}
        <div className="bg-[#1A1A2E] rounded-2xl shadow-2xl p-6 md:p-12 transition-all duration-500">
          {!isFinalStep ? (
            <div className="min-h-[400px] flex flex-col">
              {/* Header */}
              <div className=" ">
                <p className="text-gray-400 font-medium">{currentCategory.title}</p>
                <p className="text-[#89559F] font-semibold">
                  Question {currentQuestionIndex + 1} / {currentCategory.questions.length}
                </p>
              </div>
              
              {/* Question */}
              <div className="flex-grow flex flex-col items-center justify-center">
                 <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 leading-tight">
                   Connaissance Client
                 </h2>
                  <div className="w-full max-w-2xl mx-auto">
                   {currentQuestion?.type === 'radio' && (
                     <div className="space-y-4">
                       <Label className="text-lg font-medium text-gray-300">{currentQuestion.label}</Label>
                       <RadioGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {currentQuestion.options.map(opt => (
                           <RadioGroupItem
                             key={opt}
                             value={opt}
                             checked={formData[currentQuestion.key] === opt}
                             onChange={() => handleAnswer(opt)}
                           >
                             {opt}
                           </RadioGroupItem>
                         ))}
                       </RadioGroup>
                     </div>
                   )}
                  {currentQuestion?.type === 'checkbox' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentQuestion.options.map(opt => (
                        <button key={opt} onClick={() => handleAnswer(opt)} className={`p-4 rounded-xl border-2 transition-all font-semibold ${formData[currentQuestion.key]?.includes(opt) ? 'border-[#3CD4AB] bg-[#3CD4AB]/20 text-white' : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                    {currentQuestion?.type === 'select' && (
                     <div className="space-y-4">
                       <Label className="text-lg font-medium text-gray-300">{currentQuestion.label}</Label>
                      <Select 
                        value={formData[currentQuestion.key]} 
                        onValueChange={(value) => handleAnswer(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une option" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentQuestion.options.map(opt => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                     </div>
                   )}
                  {currentQuestion?.type === 'number' && (
                    <input type="number" value={formData[currentQuestion.key]} onChange={e => handleAnswer(e.target.value)} placeholder="Entrez un montant" className="w-full text-center p-4 bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:border-[#3CD4AB]" />
                  )}
                </div>
              </div>
            </div>
          ) : (
            // results
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#3CD4AB] mb-4">Profil Complété !</h2>
              <p className="text-gray-300 mb-8">Votre profil financier a été analysé avec succès.</p>
              {recommendations && (
                <div className="space-y-6 text-left">
                  <div className="bg-gray-800 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">Résumé</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
                      <p><span className="font-semibold text-white">Âge:</span> {formData.age}</p>
                      <p><span className="font-semibold text-white">Revenus:</span> {formData.incomeRange}</p>
                      <p><span className="font-semibold text-white">Profil de risque:</span> {recommendations.riskProfile.riskLevel}</p>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">Produits Recommandés</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {recommendations.matchedProducts.map((p, i) => (
                        <div key={i} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <p className="font-bold text-lg text-white">{p.nom_produit}</p>
                          <p className="text-[#3CD4AB] font-semibold">Compatibilité: {Math.round(p.overallCompatibility)}%</p>
                          <p className="text-sm text-gray-400">ROI: {p.roi_annuel || 5}% | Risque: {p.risque}/7</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-10">
            <ActionButton 
                onClick={prevQuestion} 
                disabled={currentStep === 0 && currentQuestionIndex === 0}
            >
              Retour
            </ActionButton>
            
            {!isFinalStep ? (
              <ActionButton 
                  onClick={nextQuestion} 
                  primary 
                  disabled={!isCurrentQuestionAnswered()}
              >
                Suivant
              </ActionButton>
            ) : (
              <a href="/dashboard">
                <ActionButton primary>
                  Dashboard
                </ActionButton>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialProfilingStepper; 