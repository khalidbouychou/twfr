import React, { useContext } from 'react'
import { UserContext } from '../Context/UserContext.jsx'

const Navigation = ({currentStep, totalSteps, onPrevious, handleNext, isLoading}) => {
    const { confirmAnswers } = useContext(UserContext)

    const handleButtonClick = () => {
        if (currentStep === totalSteps - 1) {
            confirmAnswers()
        } else {
            handleNext()
        }
    }

    return (
        <div className=" flex mb-10 justify-between mx-85 sticky bottom-0">
            <button 
                onClick={onPrevious}  
                disabled={currentStep === 0 || isLoading}
                className={`bg-gray-50 p-2 w-[100px] text-black font-medium cursor-pointer hover:bg-gray-200 transition-colors duration-300 rounded-md ${currentStep === 0 || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                Précédent
            </button>
            <button 
                onClick={handleButtonClick} 
                disabled={isLoading}
                className="bg-[#89559F] p-2 w-[100px] text-white font-medium cursor-pointer hover:bg-[#89559F]/80 transition-colors duration-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? "Chargement..." : (currentStep === totalSteps - 1 ? "Confirmer" : "Suivant")}
            </button>
        </div>
    )
}

export default Navigation
