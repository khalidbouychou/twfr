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
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <div className="flex items-start gap-3 rounded-md bg-red-600/95 text-white shadow-lg ring-1 ring-black/10 px-4 py-3">
          <svg className="h-5 w-5 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.5a.75.75 0 011.5 0v5a.75.75 0 01-1.5 0v-5zM10 14a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/></svg>
          <div className="text-sm font-medium">{alertMsg}</div>
          <button onClick={() => setAlertMsg("")} className="ml-auto text-white/80 hover:text-white" aria-label="Fermer">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
          </button>
        </div>
      </div>
    )}
    <div className="mx-auto flex flex-col h-screen w-full">
                <div className="flex mt-4 mb-6 mx-80">
        <div className="flex  justify-start items-center w-1/2">
        <a href="/" className="text-gray-200 text-l font-light hover:text-gray-700 ">Retour</a> 
        </div> 
        <div className="flex  justify-end items-center w-1/2">
          <a href="/"><img src="https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706711/tawfir-ai/logo.svg" alt="logo" className="w-12 h-12" /></a>
        </div>
      </div>
                
      {/* Headstepper */}
      <Headstepper currentStep={currentStep}/>
                
      {/* Categories */}
                <LoadingProvider isLoading={isLoading}>
                    <Categories 
                        currentStep={currentStep} 
                        isLoading={isLoading}
                        allAnswers={stepAnswers}
                    />
                </LoadingProvider>
                
      {/* Navigation buttons at the bottom */}
      <Navigation 
          currentStep={currentStep} 
          totalSteps={totalSteps}
          onPrevious={handlePrevious}
          handleNext={handleNext}
                    isLoading={isLoading}
        />
    </div>
            
            {/* Confirmation Popup */}
            <ConfirmationPopup />
    </>
  );
};

export default Stepper;


