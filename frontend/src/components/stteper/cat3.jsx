import React, { useState, useEffect, useRef } from 'react';

const Cat3 = ({ updateProgress, onCategoryComplete }) => {
  const [answers, setAnswers] = useState({
    incomeRange: '',
    recurringExpenses: '',
    debtRatio: '',
    lossReaction: ''
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const completionRef = useRef(false);

  const questions = [
    {
      id: 'incomeRange',
      question: 'Tranche de revenus',
      type: 'radio',
      options: [
        { value: 'less3000', label: 'Moins de 3000 Dhs' },
        { value: '3000-6000', label: '3000-6000 Dhs' },
        { value: '6000-10000', label: '6000-10000 Dhs' },
        { value: '10000-15000', label: '10000-15000 Dhs' },
        { value: 'more15000', label: 'Plus de 15000 Dhs' }
      ]
    },
    {
      id: 'recurringExpenses',
      question: 'Dépenses récurrentes',
      type: 'radio',
      options: [
        { value: 'less30', label: 'Moins de 30% du revenu' },
        { value: '30-50', label: '30-50% du revenu' },
        { value: '50-70', label: '50-70% du revenu' },
        { value: 'more70', label: 'Plus de 70% du revenu' }
      ]
    },
    {
      id: 'debtRatio',
      question: 'Évaluation du taux d\'endettement',
      type: 'radio',
      options: [
        { value: 'low', label: 'Faible : moins de 30%' },
        { value: 'moderate', label: 'Modéré : 30-45%' },
        { value: 'high', label: 'Élevé : plus de 45%' },
        { value: 'veryHigh', label: 'Très élevé : plus de 60%' }
      ]
    },
    {
      id: 'lossReaction',
      question: 'Scénarios de réaction aux pertes financières',
      type: 'radio',
      options: [
        { value: 'panic', label: 'Panique et vente immédiate' },
        { value: 'wait', label: 'Attendre et observer' },
        { value: 'buyMore', label: 'Acheter plus (opportunité)' },
        { value: 'rebalance', label: 'Rééquilibrer le portefeuille' },
        { value: 'consult', label: 'Consulter un expert' }
      ]
    }
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Calculate progress based on answered questions
  useEffect(() => {
    const answeredCount = Object.values(answers).filter(answer => answer !== '').length;
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
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Profil Financier</h2>
        <p className="text-gray-300 text-sm md:text-base">Évaluer précisément votre capacité d'investissement et situation financière actuelle</p>
        <div className="mt-4 text-xs text-gray-400">
          Question {currentQuestion + 1} / {questions.length}
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
                {q.question}
              </h3>
              
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
          disabled={currentQuestion === questions.length - 1}
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
          Analyser les ressources disponibles et la relation au risque financier pour des solutions d'investissement adaptées.
        </p>
      </div>
    </div>
  );
};

export default Cat3;
