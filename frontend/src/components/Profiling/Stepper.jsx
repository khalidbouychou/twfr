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
    showAlert._t = window.setTimeout(() => setAlertMsg(""), 3000);
  };

  // Expected number of questions per step: CC, PE, PF, PI, ESG
  const requiredCounts = [5, 5, 4, 4, 6];

  const isStepComplete = (stepIndex) => {
    const answers = (stepAnswers && stepAnswers[stepIndex]) || [];
    const validCount = (answers || []).filter(a =>
      a && a.q && (Array.isArray(a.answer) ? a.answer.length > 0 : a.answer !== undefined && a.answer !== null && String(a.answer).trim() !== "")
    ).length;
    const required = requiredCounts[stepIndex] || 0;
    return validCount >= required;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
            // Validate current step completeness before moving on
            if (!isStepComplete(currentStep)) {
                showAlert('Veuillez répondre à toutes les questions avant de continuer.');
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
    {/* Tailwind alert banner */}
    {alertMsg && (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="flex items-start gap-3 rounded-xl bg-red-600/95 text-white shadow-2xl ring-1 ring-black/10 px-5 py-4 animate-[slideDown_0.3s_ease-out]">
          <svg className="h-5 w-5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.5a.75.75 0 011.5 0v5a.75.75 0 01-1.5 0v-5zM10 14a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/></svg>
          <div className="text-sm font-medium flex-1">{alertMsg}</div>
          <button onClick={() => setAlertMsg("")} className="text-white/80 hover:text-white transition-colors" aria-label="Fermer">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
          </button>
        </div>
      </div>
    )}
    
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden">
      {/* Header */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="text-gray-300 text-sm sm:text-base font-medium hover:text-white transition-colors flex items-center gap-2 group">
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
      
      {/* Main Content Container - Centered with max height */}
      <div className="flex-1 w-full flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 pb-6">
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 lg:gap-8">
          {/* Stepper Header */}
          <Headstepper currentStep={currentStep} totalSteps={totalSteps}/>
          
          {/* Content Area - Centered */}
          <div className="w-full">
            <LoadingProvider isLoading={isLoading}>
              <Categories 
                currentStep={currentStep} 
                isLoading={isLoading}
                allAnswers={stepAnswers}
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
          />
        </div>
      </div>
    </div>
    
    {/* Confirmation Popup */}
    <ConfirmationPopup />
    </>
  );
};

export default Stepper;


