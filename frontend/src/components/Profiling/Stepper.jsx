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

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
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
            <div className="mx-auto flex flex-col h-screen w-full">
                <div className="flex mt-2 mb-6 mx-80">
                    <div className="flex  justify-start items-center w-1/2">
                        <a href="/" className="text-gray-200 text-l font-light hover:text-gray-700 ">Retour</a> 
                    </div> 
                    <div className="flex  justify-end items-center w-1/2">
                        <a href="/"><img src="../../../public/logo.svg" alt="logo" className="w-12 h-12" /></a>
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
