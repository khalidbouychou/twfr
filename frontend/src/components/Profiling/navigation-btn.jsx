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
    <div className="w-full mt-8">
      {/* Mobile Layout - Stacked buttons */}
      <div className="flex md:hidden flex-col gap-3 w-full">
        <button 
          onClick={handleButtonClick} 
          disabled={isLoading}
          className="bg-gradient-to-r from-[#89559F] to-[#9d6bb3] hover:from-[#7a4a8f] hover:to-[#89559F] p-4 w-full text-white font-semibold cursor-pointer transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg hover:shadow-xl disabled:hover:shadow-lg transform hover:scale-[1.02] disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Chargement...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {currentStep === totalSteps - 1 ? "Confirmer" : "Suivant"}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </button>
        {currentStep > 0 && (
          <button 
            onClick={onPrevious}  
            disabled={isLoading}
            className={`bg-gray-700/50 hover:bg-gray-600/70 p-4 w-full text-gray-200 font-medium cursor-pointer transition-all duration-300 rounded-xl text-base border border-gray-600/50 hover:border-gray-500 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Précédent
            </span>
          </button>
        )}
      </div>

      {/* Desktop Layout - Inline buttons */}
      <div className="hidden md:flex justify-between items-center gap-4">
        <button 
          onClick={onPrevious}  
          disabled={currentStep === 0 || isLoading}
          className={`bg-gray-700/50 hover:bg-gray-600/70 px-8 py-3.5 text-gray-200 font-medium cursor-pointer transition-all duration-300 rounded-xl text-base border border-gray-600/50 hover:border-gray-500 ${currentStep === 0 || isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-md transform hover:scale-[1.02]"}`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Précédent
          </span>
        </button>
        <button 
          onClick={handleButtonClick} 
          disabled={isLoading}
          className="bg-gradient-to-r from-[#89559F] to-[#9d6bb3] hover:from-[#7a4a8f] hover:to-[#89559F] px-10 py-3.5 text-white font-semibold cursor-pointer transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-lg hover:shadow-xl disabled:hover:shadow-lg transform hover:scale-[1.02] disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Chargement...</span>
            </div>
          ) : (
            <span className="flex items-center gap-2">
              {currentStep === totalSteps - 1 ? "Confirmer" : "Suivant"}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

export default Navigation
