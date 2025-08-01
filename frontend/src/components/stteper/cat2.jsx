import React, { useState, useEffect, useRef } from 'react';

const Cat2 = ({ updateProgress, onCategoryComplete }) => {
  const [answers, setAnswers] = useState({
    savingFrequency: '',
    timeScale: '',
    motivations: []
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const completionRef = useRef(false);

  const questions = [
    {
      id: 'motivations',
      question: 'Motivations de l\'épargne',
      type: 'checkbox',
      options: [
        { value: 'emergency', label: 'Fonds d\'urgence' },
        { value: 'retirement', label: 'Préparation retraite' },
        { value: 'realEstate', label: 'Acquisition immobilière' },
        { value: 'education', label: 'Éducation des enfants' },
        { value: 'travel', label: 'Voyages et loisirs' },
        { value: 'business', label: 'Création d\'entreprise' },
        { value: 'inheritance', label: 'Héritage pour enfants' }
      ]
    },
    {
      id: 'savingFrequency',
      question: 'Fréquence et méthode d\'épargne',
      type: 'radio',
      options: [
        { value: 'never', label: 'Jamais d\'épargne' },
        { value: 'occasional', label: 'Épargne occasionnelle' },
        { value: 'monthly', label: 'Épargne mensuelle' },
        { value: 'automatic', label: 'Épargne automatique' },
        { value: 'percentage', label: 'Pourcentage du salaire' }
      ]
    },
    {
      id: 'timeScale',
      question: 'Échelle temporelle de l\'épargne',
      type: 'radio',
      options: [
        { value: 'short', label: 'Court terme (0-2 ans)' },
        { value: 'medium', label: 'Moyen terme (3-5 ans)' },
        { value: 'long', label: 'Long terme (6-10 ans)' },
        { value: 'veryLong', label: 'Très long terme (10+ ans)' }
      ]
    }
  ];

  const handleAnswer = (questionId, value) => {
    if (questionId === 'motivations') {
      setAnswers(prev => ({
        ...prev,
        [questionId]: prev[questionId].includes(value)
          ? prev[questionId].filter(item => item !== value)
          : [...prev[questionId], value]
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
    }
  };

  // Calculate progress based on answered questions (all required)
  useEffect(() => {
    const answeredCount = Object.entries(answers).filter(([key, value]) => {
      if (key === 'motivations') {
        return value.length > 0;
      }
      return value !== '';
    }).length;
    const progressPercentage = (answeredCount / questions.length) * 100;
    updateProgress(progressPercentage, answers);
    
    // Only call onCategoryComplete once when all questions are answered
    if (answeredCount === questions.length && !completionRef.current && onCategoryComplete) {
      completionRef.current = true;
      onCategoryComplete();
    }
  }, [answers, updateProgress, onCategoryComplete]);

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Profil Épargnant</h2>
        <p className="text-gray-300 text-sm md:text-base">Analyser vos comportements d'épargne et objectifs financiers</p>
        <div className="mt-4 text-xs text-gray-400">
          Question {currentQuestion + 1} / {questions.length} <span className="text-red-400">*</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Progression: {Math.round((currentQuestion / questions.length) * 100)}%</span>
          <span className="text-sm text-gray-300">
            {currentQuestion + 1} / {questions.length} questions
          </span>
        </div>
        <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: 'rgba(137, 85, 159, 0.3)' }}>
          <div 
            className="h-2 rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${(currentQuestion / questions.length) * 100}%`,
              background: 'linear-gradient(90deg, #3CD4AB, #89559F)'
            }}
          ></div>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        {(() => {
          const q = questions[currentQuestion];
          return (
            <div className="rounded-xl p-6 border transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md" style={{ backgroundColor: '#0F0F19', borderColor: '#89559F' }}>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3" style={{ backgroundColor: '#3CD4AB' }}>
                  {currentQuestion + 1}
                </span>
                {q.question} <span className="text-red-400 ml-1">*</span>
              </h3>
              
              {q.type === 'radio' && (
                <div className="space-y-3">
                  {q.options.map(option => (
                    <label key={option.value} className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg border-2 border-transparent hover:border-opacity-50 hover:bg-opacity-10 transition-all duration-200" style={{ borderColor: '#89559F', hoverBorderColor: '#89559F', hoverBackgroundColor: 'rgba(137, 85, 159, 0.1)' }}>
                      <div className="relative">
                        <input
                          type="radio"
                          name={q.id}
                          value={option.value}
                          checked={answers[q.id] === option.value}
                          onChange={(e) => handleAnswer(q.id, e.target.value)}
                          className="sr-only"
                          required
                        />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          answers[q.id] === option.value 
                            ? 'border-opacity-100 bg-opacity-100' 
                            : 'border-opacity-50 bg-opacity-0'
                        }`} style={{ borderColor: '#89559F', backgroundColor: answers[q.id] === option.value ? '#3CD4AB' : 'transparent' }}>
                          {answers[q.id] === option.value && (
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0F0F19' }}></div>
                          )}
                        </div>
                      </div>
                      <span className="font-medium text-white">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'checkbox' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map(option => (
                    <label key={option.value} className="flex items-center space-x-4 cursor-pointer p-3 rounded-lg border-2 border-transparent hover:border-opacity-50 hover:bg-opacity-10 transition-all duration-200" style={{ borderColor: '#89559F', hoverBorderColor: '#89559F', hoverBackgroundColor: 'rgba(137, 85, 159, 0.1)' }}>
                      <div className="relative">
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={answers[q.id].includes(option.value)}
                          onChange={(e) => handleAnswer(q.id, e.target.value)}
                          className="sr-only"
                          required
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          answers[q.id].includes(option.value)
                            ? 'border-opacity-100 bg-opacity-100' 
                            : 'border-opacity-50 bg-opacity-0'
                        }`} style={{ borderColor: '#89559F', backgroundColor: answers[q.id].includes(option.value) ? '#3CD4AB' : 'transparent' }}>
                          {answers[q.id].includes(option.value) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="font-medium text-white">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <div className="flex justify-between mt-6 max-w-xl mx-auto">
        <button
          className="px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          style={{ backgroundColor: '#89559F' }}
          onClick={handlePrev}
          disabled={currentQuestion === 0}
        >
          Précédent
        </button>
        <button
          className="px-6 py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          style={{ backgroundColor: '#3CD4AB' }}
          onClick={() => {
            if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
          }}
          disabled={currentQuestion === questions.length - 1 || !answers[questions[currentQuestion].id]}
        >
          Suivant
        </button>
      </div>

      <div className="mt-8 p-6 rounded-xl border" style={{ backgroundColor: 'rgba(137, 85, 159, 0.1)', borderColor: '#89559F' }}>
        <h4 className="font-semibold mb-3 flex items-center" style={{ color: '#3CD4AB' }}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Objectif de cette section
        </h4>
        <p className="text-gray-300 text-sm md:text-base">
          Évaluer la discipline d'épargne, la vision temporelle des investissements et les motivations concrètes derrière l'épargne.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          <span className="text-red-400">*</span> Tous les champs sont obligatoires
        </p>
      </div>
    </div>
  );
};

export default Cat2;
