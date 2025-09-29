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
    <div className="px-4 lg:px-8 mb-6 lg:mb-10 sticky bottom-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent pt-6">
      {/* Mobile Layout - Stacked buttons */}
      <div className="flex md:hidden flex-col gap-3">
        <button 
          onClick={handleButtonClick} 
          disabled={isLoading}
          className="bg-[#89559F] p-3 w-full text-white font-semibold cursor-pointer hover:bg-[#89559F]/90 transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Chargement...
            </div>
          ) : (
            currentStep === totalSteps - 1 ? "Confirmer" : "Suivant"
          )}
        </button>
        {currentStep > 0 && (
          <button 
            onClick={onPrevious}  
            disabled={isLoading}
            className={`bg-gray-600 p-3 w-full text-white font-medium cursor-pointer hover:bg-gray-500 transition-all duration-300 rounded-lg text-base ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Précédent
          </button>
        )}
      </div>

      {/* Desktop Layout - Inline buttons */}
      <div className="hidden md:flex justify-between items-center gap-4">
        <button 
          onClick={onPrevious}  
          disabled={currentStep === 0 || isLoading}
          className={`bg-gray-600 hover:bg-gray-500 p-3 px-6 text-white font-medium cursor-pointer transition-all duration-300 rounded-lg text-base ${currentStep === 0 || isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}`}
        >
          Précédent
        </button>
        <button 
          onClick={handleButtonClick} 
          disabled={isLoading}
          className="bg-[#89559F] hover:bg-[#89559F]/90 p-3 px-8 text-white font-semibold cursor-pointer transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Chargement...
            </div>
          ) : (
            currentStep === totalSteps - 1 ? "Confirmer" : "Suivant"
          )}
        </button>
      </div>
    </div>
  )
}

export default Navigation
