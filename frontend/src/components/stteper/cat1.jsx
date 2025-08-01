import React, { useState, useEffect, useRef } from 'react';

const Cat1 = ({ updateProgress, onCategoryComplete }) => {
  const [answers, setAnswers] = useState({
    dateOfBirth: '',
    calculatedAge: '',
    gender: '',
    familySituation: '',
    residence: '',
    education: ''
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const completionRef = useRef(false);

  const questions = [
    {
      id: 'dateOfBirth',
      question: 'Date de naissance',
      type: 'date',
      placeholder: 'Sélectionnez votre date de naissance'
    },
    {
      id: 'gender',
      question: 'Genre',
      type: 'radio',
      options: [
        { 
          value: 'male', 
          label: 'Homme',
          avatar: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )
        },
        { 
          value: 'female', 
          label: 'Femme',
          avatar: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              <circle cx="12" cy="8" r="3" />
            </svg>
          )
        }
      ]
    },
    {
      id: 'familySituation',
      question: 'Situation familiale',
      type: 'radio',
      options: [
        { value: 'single', label: 'Célibataire' },
        { value: 'relationship', label: 'En couple' },
        { value: 'withChildren', label: 'Avec enfant(s)' },
        { value: 'married', label: 'Marié(e)' },
        { value: 'divorced', label: 'Divorcé(e)' }
      ]
    },
    {
      id: 'residence',
      question: 'Zone d\'habitation',
      type: 'radio',
      options: [
        { value: 'urban', label: 'Urbaine' },
        { value: 'suburban', label: 'Suburbaine' },
        { value: 'rural', label: 'Rurale' },
        { value: 'coastal', label: 'Côtière' },
        { value: 'mountain', label: 'Montagneuse' }
      ]
    },
    {
      id: 'education',
      question: 'Niveau d\'études',
      type: 'radio',
      options: [
        { value: 'primary', label: 'Primaire' },
        { value: 'secondary', label: 'Secondaire' },
        { value: 'higher', label: 'Supérieur' },
        { value: 'vocational', label: 'Formation professionnelle' },
        { value: 'postgraduate', label: 'Post-graduation' }
      ]
    }
  ];

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  // Calculate progress based on answered questions (all required)
  useEffect(() => {
    const answeredCount = Object.entries(answers).filter(([key, value]) => {
      // Don't count calculatedAge in progress calculation
      if (key === 'calculatedAge') return false;
      return value !== '';
    }).length;
    const progressPercentage = (answeredCount / (questions.length)) * 100;
    updateProgress(progressPercentage, answers);
    
    // Only call onCategoryComplete once when all questions are answered
    if (answeredCount === questions.length && !completionRef.current && onCategoryComplete) {
      completionRef.current = true;
      onCategoryComplete();
    }
  }, [answers, updateProgress, onCategoryComplete]);

  const handleAnswer = (questionId, value) => {
    if (questionId === 'dateOfBirth') {
      const age = calculateAge(value);
      setAnswers(prev => ({
        ...prev,
        [questionId]: value,
        calculatedAge: age
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
    }
    // Remove auto-advance functionality
    // if (currentQuestion < questions.length - 1) {
    //   setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    // }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Connaissance Client (KYC simplifié)</h2>
        <p className="text-gray-300 text-sm md:text-base">Comprendre votre profil personnel et contexte socio-économique</p>
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
              {q.type === 'date' && (
                <div className="space-y-3">
                  <input
                    type="date"
                    value={answers[q.id]}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    className="w-full p-4 border-2 rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 font-medium"
                    style={{ 
                      backgroundColor: '#0F0F19', 
                      borderColor: '#89559F', 
                      color: '#FFF',
                      focusRingColor: '#3CD4AB'
                    }}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                  {answers.calculatedAge && (
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'rgba(137, 85, 159, 0.1)', borderColor: '#89559F' }}>
                      <span className="font-medium" style={{ color: '#3CD4AB' }}>
                        Âge calculé : <span className="font-bold">{answers.calculatedAge} ans</span>
                      </span>
                    </div>
                  )}
                </div>
              )}
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
                      <div className="flex items-center space-x-3">
                        {option.avatar && (
                          <div className={`p-2 rounded-full transition-all duration-200 ${
                            answers[q.id] === option.value 
                              ? 'bg-opacity-20 text-opacity-100' 
                              : 'bg-opacity-10 text-opacity-50'
                          }`} style={{ backgroundColor: 'rgba(137, 85, 159, 0.2)', color: '#3CD4AB' }}>
                            {option.avatar}
                          </div>
                        )}
                        <span className="font-medium text-white">{option.label}</span>
                      </div>
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
          Établir un profil socio-démographique précis pour personnaliser l'expérience et affiner les recommandations d'investissement.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          <span className="text-red-400">*</span> Tous les champs sont obligatoires
        </p>
      </div>
    </div>
  );
};

export default Cat1;
