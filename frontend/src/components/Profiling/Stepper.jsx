import React, { useState, useContext } from "react";
import Headstepper from "./headstepper";
import Navigation from "./navigation-btn";
import Categories from "./categories";
import { LoadingProvider } from "./LoadingContext";
import ConfirmationPopup from "./ConfirmationPopup";
import { UserContext } from '../Context/UserContext.jsx';

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
    const [isLoading, setIsLoading] = useState(false);
    const { stepAnswers } = useContext(UserContext);

  // Toast-like alert state
  const [alertMsg, setAlertMsg] = useState("");
  const showAlert = (msg) => {
    setAlertMsg(msg);
    window.clearTimeout(showAlert._t);
    showAlert._t = window.setTimeout(() => setAlertMsg(""), 5000); // 5 seconds for longer messages
  };

  // Expected number of questions per step: CC, PE, PF, PI, ESG
  const requiredCounts = [5, 5, 4, 4, 6];

  // Question titles for each step
  const stepQuestions = [
    // CC - Connaissance Client
    [
      "Quel est votre sexe ?",
      "Quel est votre âge ?",
      "Quelle est votre situation familiale ?",
      "Dans quelle zone habitez-vous ?",
      "Quel est votre niveau d'étude ?"
    ],
    // PE - Profil Épargnant
    [
      "Quelle méthode utilisez-vous pour épargner ?",
      "À quelle fréquence épargnez-vous ?",
      "Pour quels objectifs épargnez-vous ?",
      "Sur quel horizon de temps placez-vous vos priorités ?",
      "Quel est votre niveau d'épargne actuel ?"
    ],
    // PF - Profil Financier
    [
      "Quelle est votre tranche de revenus mensuels ?",
      "Épargnez-vous actuellement ?",
      "Sur quelle durée principale souhaitez-vous placer votre argent ?",
      "Quels sont vos objectifs prioritaires d'épargne ?"
    ],
    // PI - Profil Investisseur
    [
      "Avez-vous déjà investi dans l'un des produits suivants ?",
      "Comment réagissez-vous face aux baisses soudaines des marchés financiers ?",
      "Sur quels critères prenez-vous vos décisions d'investissement ?",
      "À quelle fréquence suivez-vous vos investissements ?"
    ],
    // ESG - Critères ESG
    [
      "Environnement - Question 1",
      "Environnement - Question 2",
      "Social - Question 1",
      "Social - Question 2",
      "Gouvernance - Question 1",
      "Gouvernance - Question 2"
    ]
  ];

  const isStepComplete = (stepIndex) => {
    const answers = (stepAnswers && stepAnswers[stepIndex]) || [];
    const validCount = (answers || []).filter(a =>
      a && a.q && (Array.isArray(a.answer) ? a.answer.length > 0 : a.answer !== undefined && a.answer !== null && String(a.answer).trim() !== "")
    ).length;
    const required = requiredCounts[stepIndex] || 0;
    return validCount >= required;
  };

  const getMissingFields = (stepIndex) => {
    const answers = (stepAnswers && stepAnswers[stepIndex]) || [];
    const answeredQuestions = answers
      .filter(a => a && a.q && (Array.isArray(a.answer) ? a.answer.length > 0 : a.answer !== undefined && a.answer !== null && String(a.answer).trim() !== ""))
      .map(a => a.q);
    
    const questions = stepQuestions[stepIndex] || [];
    const missingQuestions = questions.filter(q => {
      // Check if this question has been answered
      return !answeredQuestions.some(aq => aq.includes(q.substring(0, 20)) || q.includes(aq.substring(0, 20)));
    });
    
    return missingQuestions;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
            // Validate current step completeness before moving on
            if (!isStepComplete(currentStep)) {
                const missingFields = getMissingFields(currentStep);
                if (missingFields.length > 0) {
                  const fieldsList = missingFields.map((field, idx) => `${idx + 1}. ${field}`).join('\n');
                  showAlert(`Veuillez répondre aux questions suivantes :\n\n${fieldsList}`);
                } else {
                  showAlert('Veuillez répondre à toutes les questions avant de continuer.');
                }
                return;
            }
            setIsLoading(true);
            setCurrentStep(prev => prev + 1);
            setTimeout(() => {
                setIsLoading(false);
            }, 700);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
            setIsLoading(true);
            setCurrentStep(prev => prev - 1);
            setTimeout(() => {
                setIsLoading(false);
            }, 400);
    }
  };

  return (
    <>
    {/* Single unified validation alert - top-right corner */}
    {alertMsg && (
      <div className="fixed top-4 right-4 z-50 w-full max-w-md px-4 animate-[slideInRight_0.3s_ease-out]">
        <div className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white shadow-2xl ring-1 ring-red-900/20 px-5 py-4 backdrop-blur-sm">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-2">Formulaire incomplet</h3>
            <p className="text-sm font-light leading-relaxed whitespace-pre-line">{alertMsg}</p>
          </div>
          <button 
            onClick={() => setAlertMsg("")} 
            className="flex-shrink-0 text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg" 
            aria-label="Fermer"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    )}
    
    <div className="min-h-screen w-full flex flex-col overflow-hidden" style={{backgroundColor: '#0F0F19'}}>
      {/* Header */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="text-gray-300 text-sm sm:text-base font-light hover:text-white transition-colors flex items-center gap-2 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </a>
          <a href="/" className="hover:opacity-80 transition-opacity">
            <img src="https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706711/tawfir-ai/logo.svg" alt="logo" className="w-10 h-10 sm:w-12 sm:h-12" />
          </a>
        </div>
      </div>
      
      {/* Main Content Container - Scrollable area */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden">
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-5">
            {/* Stepper Header */}
            <Headstepper currentStep={currentStep} totalSteps={totalSteps}/>
            
            {/* Content Area */}
            <div className="w-full">
              <LoadingProvider isLoading={isLoading}>
                <Categories 
                  currentStep={currentStep} 
                  isLoading={isLoading}
                />
              </LoadingProvider>
            </div>
            
            {/* Navigation buttons */}
            <Navigation 
              currentStep={currentStep} 
              totalSteps={totalSteps}
              onPrevious={handlePrevious}
              handleNext={handleNext}
              isLoading={isLoading}
              isStepComplete={isStepComplete}
              showAlert={showAlert}
              getMissingFields={getMissingFields}
            />
          </div>
        </div>
      </div>
    </div>
    
    {/* Confirmation Popup */}
    <ConfirmationPopup />
    </>
  );
};

export default Stepper;


