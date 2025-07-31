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

// Simple, clean color scheme - using inline styles instead of variables

const SimulationStepper = () => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState([0, 0, 0, 0, 0]);
  const [allAnswers, setAllAnswers] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update progress for a specific category
  const updateProgress = (categoryIndex, newProgress, answers) => {
    const newProgressArray = [...progress];
    newProgressArray[categoryIndex] = newProgress;
    setProgress(newProgressArray);
    
    // Store answers
    setAllAnswers(prev => ({
      ...prev,
      [categoryIndex]: answers
    }));
  };

  // Remove old auto-advance effect
  // const isCurrentComplete = progress[current] >= 100;
  // useEffect(() => { ... });

  const handleNext = () => {
    if (current === categories.length - 1) {
      setShowConfirmation(true);
    } else {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(prev => prev - 1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBackToStepper = () => {
    setShowConfirmation(false);
  };

  // Format answer for display
  const formatAnswer = (question, answer) => {
    if (Array.isArray(answer)) {
      // Handle multi-select answers (like motivations)
      const motivationLabels = {
        'emergency': 'Fonds d\'urgence',
        'retirement': 'Préparation retraite',
        'realEstate': 'Acquisition immobilière',
        'education': 'Éducation des enfants',
        'travel': 'Voyages et loisirs',
        'business': 'Création d\'entreprise',
        'inheritance': 'Héritage pour enfants'
      };
      return answer.length > 0 ? answer.map(value => motivationLabels[value] || value).join(', ') : 'Non spécifié';
    }
    
    // Handle special cases
    if (question === 'calculatedAge' && answer) {
      return `${answer} ans`;
    }
    if (question === 'dateOfBirth' && answer) {
      const date = new Date(answer);
      return date.toLocaleDateString('fr-FR');
    }
    
    // Value to label mappings for each question type
    const valueMappings = {
      // Cat1 - Connaissance Client
      gender: {
        'male': 'Homme',
        'female': 'Femme'
      },
      familySituation: {
        'single': 'Célibataire',
        'relationship': 'En couple',
        'withChildren': 'Avec enfant(s)',
        'married': 'Marié(e)',
        'divorced': 'Divorcé(e)'
      },
      residence: {
        'urban': 'Urbaine',
        'suburban': 'Suburbaine',
        'rural': 'Rurale',
        'coastal': 'Côtière',
        'mountain': 'Montagneuse'
      },
      education: {
        'primary': 'Primaire',
        'secondary': 'Secondaire',
        'higher': 'Supérieur',
        'vocational': 'Formation professionnelle',
        'postgraduate': 'Post-graduation'
      },
      
      // Cat2 - Profil Épargnant
      savingFrequency: {
        'never': 'Jamais d\'épargne',
        'occasional': 'Épargne occasionnelle',
        'monthly': 'Épargne mensuelle',
        'automatic': 'Épargne automatique',
        'percentage': 'Pourcentage du salaire'
      },
      timeScale: {
        'short': 'Court terme (0-2 ans)',
        'medium': 'Moyen terme (3-5 ans)',
        'long': 'Long terme (6-10 ans)',
        'veryLong': 'Très long terme (10+ ans)'
      },
      
      // Cat3 - Profil Financier
      incomeRange: {
        'less3000': 'Moins de 3000 Dhs',
        '3000-6000': '3000-6000 Dhs',
        '6000-10000': '6000-10000 Dhs',
        '10000-15000': '10000-15000 Dhs',
        'more15000': 'Plus de 15000 Dhs'
      },
      recurringExpenses: {
        'less30': 'Moins de 30% du revenu',
        '30-50': '30-50% du revenu',
        '50-70': '50-70% du revenu',
        'more70': 'Plus de 70% du revenu'
      },
      debtRatio: {
        'low': 'Faible : moins de 30%',
        'moderate': 'Modéré : 30-45%',
        'high': 'Élevé : plus de 45%',
        'veryHigh': 'Très élevé : plus de 60%'
      },
      lossReaction: {
        'panic': 'Panique et vente immédiate',
        'wait': 'Attendre et observer',
        'buyMore': 'Acheter plus (opportunité)',
        'rebalance': 'Rééquilibrer le portefeuille',
        'consult': 'Consulter un expert'
      },
      
      // Cat4 - Profil Investisseur
      investmentExperience: {
        'none': 'Aucune expérience',
        'beginner': 'Débutant (moins de 2 ans)',
        'intermediate': 'Intermédiaire (2-5 ans)',
        'advanced': 'Avancé (plus de 5 ans)',
        'expert': 'Expert (plus de 10 ans)'
      },
      marketFluctuations: {
        'calm': 'Je reste calme',
        'concerned': 'Je suis préoccupé',
        'excited': 'Je vois des opportunités',
        'indifferent': 'Je suis indifférent',
        'strategic': 'Je réévalue ma stratégie'
      },
      confidenceLevel: {
        'low': 'Faible confiance',
        'moderate': 'Confiance modérée',
        'high': 'Haute confiance',
        'veryHigh': 'Très haute confiance',
        'expert': 'Confiance d\'expert'
      },
      suddenDrops: {
        'panic': 'Panique et vente immédiate',
        'wait': 'Attendre et observer',
        'buyMore': 'Acheter plus (opportunité)',
        'rebalance': 'Rééquilibrer le portefeuille',
        'consult': 'Consulter un expert'
      },
      
      // Cat5 - Sensibilités ESG
      environmentalExclusion: {
        'notImportant': 'Pas important pour moi',
        'somewhatImportant': 'Assez important',
        'veryImportant': 'Très important',
        'essential': 'Essentiel',
        'mandatory': 'Obligatoire'
      },
      inclusionPolicies: {
        'low': 'Faible importance',
        'medium': 'Importance moyenne',
        'high': 'Haute importance',
        'critical': 'Critique',
        'priority': 'Priorité absolue'
      },
      ethicalGovernance: {
        'noPreference': 'Aucune préférence',
        'prefer': 'Je préfère',
        'stronglyPrefer': 'Je préfère fortement',
        'require': 'J\'exige cela',
        'exclusive': 'Exclusivement ces entreprises'
      }
    };
    
    // Return the mapped label if available, otherwise return the original answer
    const mapping = valueMappings[question];
    if (mapping && answer) {
      return mapping[answer] || answer;
    }
    
    return answer || 'Non spécifié';
  };

  // Get question labels for display
  const getQuestionLabel = (categoryIndex, questionId) => {
    const questionMaps = {
      0: { // Connaissance Client (KYC simplifié)
        dateOfBirth: 'Date de naissance',
        calculatedAge: 'Âge',
        gender: 'Genre',
        familySituation: 'Situation familiale',
        residence: 'Zone d\'habitation',
        education: 'Niveau d\'études'
      },
      1: { // Profil Épargnant
        savingFrequency: 'Fréquence et méthode d\'épargne',
        timeScale: 'Échelle temporelle de l\'épargne',
        motivations: 'Motivations de l\'épargne'
      },
      2: { // Profil Financier
        incomeRange: 'Tranche de revenus',
        recurringExpenses: 'Dépenses récurrentes',
        debtRatio: 'Évaluation du taux d\'endettement',
        lossReaction: 'Scénarios de réaction aux pertes financières'
      },
      3: { // Profil Investisseur
        investmentExperience: 'Expérience d\'investissement',
        marketFluctuations: 'Réactions face aux fluctuations du marché',
        confidenceLevel: 'Niveau de confiance dans les décisions d\'investissement',
        suddenDrops: 'Comportement face aux baisses soudaines du marché'
      },
      4: { // Sensibilités ESG
        environmentalExclusion: 'Exclusion des entreprises à fort impact environnemental',
        inclusionPolicies: 'Importance des politiques d\'inclusion et d\'équité',
        ethicalGovernance: 'Préférences pour les entreprises avec des pratiques de gouvernance éthiques'
      }
    };
    return questionMaps[categoryIndex]?.[questionId] || questionId;
  };

  // Pass onCategoryComplete to each category
  const renderCategory = () => {
    if (!categories[current]) return null;
    const CategoryComponent = categories[current].component.type;
    return (
      <CategoryComponent
        progress={progress[current]}
        updateProgress={(newProgress, answers) => updateProgress(current, newProgress, answers)}
        onCategoryComplete={handleNext}
      />
    );
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#0F0F19' }}>
        {/* Header */}
        <div className="shadow-sm border-b" style={{ backgroundColor: '#0F0F19', borderColor: '#89559F' }}>
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center text-white cursor-pointer hover:text-gray-300 transition-colors" onClick={handleBackToStepper}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Retour</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3CD4AB' }}>
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-white ml-2">Tawfir</span>
            </div>
            <div className="w-20"></div>
          </div>
        </div>

        {/* Confirmation Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#3CD4AB' }}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Profil Complété !</h1>
            <p className="text-gray-300">Vérifiez vos réponses avant de continuer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat, categoryIndex) => (
              <div key={categoryIndex} className={`rounded-xl shadow-sm border p-6 ${categoryIndex === categories.length - 1 ? 'md:col-span-2' : ''}`} style={{ backgroundColor: '#0F0F19', borderColor: '#89559F' }}>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#3CD4AB' }}>
                    <span className="text-white font-bold">{categoryIndex + 1}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{cat.label}</h2>
                </div>
                
                <div className="space-y-3">
                  {allAnswers[categoryIndex] && Object.entries(allAnswers[categoryIndex]).map(([questionId, answer]) => (
                    <div key={questionId} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(137, 85, 159, 0.1)' }}>
                      <span className="font-medium text-gray-300 mb-1 sm:mb-0">
                        {getQuestionLabel(categoryIndex, questionId)}:
                      </span>
                      <span className="font-medium" style={{ color: '#3CD4AB' }}>
                        {formatAnswer(questionId, answer)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBackToStepper}
              className="px-8 py-3 text-white font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: '#89559F' }}
            >
              Modifier
            </button>
            <button
              className="px-8 py-3 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
              style={{ backgroundColor: '#3CD4AB' }}
            >
              Confirmer et Continuer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prevent rendering if current is out of bounds
  if (current < 0 || current >= categories.length) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F0F19' }}>
      {/* Header */}
      <div className="shadow-sm border-b" style={{ backgroundColor: '#0F0F19', borderColor: '#89559F' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center text-white cursor-pointer hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Retour</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3CD4AB' }}>
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-white ml-2">Tawfir</span>
          </div>
          <div className="flex items-center text-white cursor-pointer hover:text-gray-300 transition-colors">
            <span className="font-medium mr-2">Aide</span>
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3CD4AB' }}>
              <span className="text-white text-sm font-bold">?</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stepper */}
        <div className="flex items-center justify-between w-full overflow-x-auto pb-6 scrollbar-hide">
          {categories.map((cat, idx) => (
            <React.Fragment key={cat.label}>
              <div className="flex flex-col items-center min-w-[80px]">
                <button
                  className="flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-base transition-all duration-300 focus:outline-none transform hover:scale-105"
                  style={{
                    backgroundColor: idx === current ? '#3CD4AB' : 
                                   idx < current ? '#3CD4AB' : '#0F0F19',
                    borderColor: idx === current ? 'transparent' : 
                                idx < current ? 'transparent' : '#89559F',
                    color: '#FFF'
                  }}
                  onClick={() => setCurrent(idx)}
                  disabled={idx > current}
                  aria-current={idx === current ? 'step' : undefined}
                >
                  {idx < current ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </button>
                <div className="mt-2 flex flex-col items-center transition-colors" style={{ color: idx === current ? '#3CD4AB' : idx < current ? '#3CD4AB' : '#FFF' }}>
                  {icons[idx]}
                  <span className="text-xs font-medium mt-1 text-center whitespace-nowrap">
                    {cat.label}
                  </span>
                </div>
              </div>
              {/* Connector line except after last step */}
              {idx < categories.length - 1 && (
                <div className="flex-1 h-1 mx-2 relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 rounded-full transition-all duration-500" style={{ backgroundColor: idx < current ? '#3CD4AB' : '#89559F' }}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Current Category Component */}
        <div className={`rounded-xl shadow-sm border p-6 min-h-[400px] transition-all duration-300 ${isTransitioning ? 'opacity-50 transform scale-95' : 'opacity-100 transform scale-100'}`} style={{ backgroundColor: '#0F0F19', borderColor: '#89559F' }}>
          {renderCategory()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            style={{ backgroundColor: '#89559F' }}
            onClick={handlePrevious}
            disabled={current === 0}
          >
            Précédent
          </button>
          {/* Hide next/finish button, navigation is now handled by per-category stepper */}
        </div>
      </div>
    </div>
  );
};

export default SimulationStepper; 