import React, { useContext, useState } from 'react'
import { UserContext } from '../Context/UserContext.jsx'
import { RecommendationEngine } from '../Algo'

const ConfirmationPopup = () => {
    const { 
        userAnswers, 
        showConfirmationPopup, 
        setShowConfirmationPopup, 
        stepAnswers
    } = useContext(UserContext)
    
    const [activeStep, setActiveStep] = useState(0)
    const [showThankYou, setShowThankYou] = useState(false)
    const [recommendationResults, setRecommendationResults] = useState(null)

    if (!showConfirmationPopup) return null

    const stepNames = {
        0: "Coordonnées et Caractéristiques",
        1: "Profil d'Épargne", 
        2: "Profil Financier",
        3: "Profil d'Investisseur",
        4: "ESG"
    }

    const getAnswersByStep = () => {
        const answersByStep = {}
        userAnswers.forEach((answer, index) => {
            let stepIndex = -1
            for (let i = 0; i < 5; i++) {
                if (stepAnswers[i] && stepAnswers[i].some(stepAnswer => 
                    stepAnswer?.q === answer?.q && stepAnswer?.answer === answer?.answer
                )) {
                    stepIndex = i
                    break
                }
            }
            if (stepIndex !== -1) {
                if (!answersByStep[stepIndex]) {
                    answersByStep[stepIndex] = []
                }
                answersByStep[stepIndex].push({ ...answer, originalIndex: index })
            }
        })
        return answersByStep
    }

    const answersByStep = getAnswersByStep()

    const handleConfirm = () => {
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers))
        try {
            const engine = new RecommendationEngine()
            const results = engine.generateCompleteRecommendation(userAnswers)
            localStorage.setItem('userResults', JSON.stringify(results))
            setRecommendationResults(results)
        } catch (e) {
            console.error('Recommendation generation failed:', e)
            setRecommendationResults(null)
        }
        setShowThankYou(true)
    }

    const handleGoToDashboard = () => {
        window.location.href = '/dashboard'
    }

    // Thank you popup
    if (showThankYou) {
        return (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4">
                <div className="bg-white p-4 lg:p-8 rounded-lg max-w-2xl w-full max-w-[90%] max-h-[90%] overflow-y-auto">
                    <div className="mb-4 lg:mb-6 text-center">
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                            <svg className="w-6 h-6 lg:w-8 lg:h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">Merci !</h2>
                        <p className="text-gray-600 text-sm lg:text-base">
                            Votre profil a été enregistré. Voici vos recommandations personnalisées.
                        </p>
                    </div>

                    {recommendationResults && Array.isArray(recommendationResults.matchedProducts) && recommendationResults.matchedProducts.length > 0 && (
                        <div className="mb-4 lg:mb-6">
                            <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-3">Produits recommandés</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {recommendationResults.matchedProducts.slice(0, 6).map((p, idx) => (
                                    <div key={p.id || idx} className="border border-gray-200 rounded-lg p-3 flex items-start gap-3 bg-white">
                                        <img src={p.avatar} alt={p.nom_produit} className="w-10 h-10 lg:w-12 lg:h-12 rounded object-cover" />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-800 line-clamp-2 text-sm lg:text-base">{p.nom_produit}</div>
                                            <div className="text-xs lg:text-sm text-gray-500">Risque: {p.risque}/7 • ROI: {(p.rendement_annuel_moyen ?? p.roi_annuel ?? 5)}%</div>
                                            <div className="text-xs lg:text-sm text-emerald-600">Compatibilité: {Math.round(p.overallCompatibility)}%</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleGoToDashboard}
                        className="w-full px-4 lg:px-6 py-2 lg:py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors text-sm lg:text-base"
                    >
                        Aller au dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4">
            <div className="bg-white p-4 lg:p-6 rounded-lg max-w-[95%] lg:max-w-[90%] max-h-[90%] overflow-auto w-full lg:w-[900px]">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4">Récapitulatif de vos réponses</h2>

                {/* Category menu */}
                <div className="w-full overflow-x-auto">
                    <div className="flex gap-1 lg:gap-2 whitespace-nowrap border-b border-gray-200 pb-2">
                        {[0,1,2,3,4].map((idx) => (
                            <button
                                key={idx}
                                className={`px-2 lg:px-3 py-1 lg:py-2 rounded-md text-xs lg:text-sm transition-colors ${activeStep === idx ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                onClick={() => setActiveStep(idx)}
                            >
                                {stepNames[idx]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Answers list for active category */}
                <div className="mt-4">
                    <h3 className="text-emerald-600 border-b-2 border-emerald-400 pb-1 mb-3 font-medium text-sm lg:text-base">
                        {stepNames[activeStep]}
                    </h3>

                    {Array.isArray(answersByStep[activeStep]) && answersByStep[activeStep].length > 0 ? (
                        <div className="space-y-2 lg:space-y-3">
                            {answersByStep[activeStep].map((answer, i) => (
                                <div key={i} className="p-2 lg:p-3 border border-gray-200 rounded bg-white">
                                    <div className="text-gray-800 text-sm lg:text-base">
                                        <span className="font-semibold">Question: </span>{answer.q}
                                    </div>
                                    <div className="text-gray-700 mt-1 text-sm lg:text-base">
                                        <span className="font-semibold">Réponse: </span>
                                        {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
                                    </div>
                                    {answer.category && (
                                        <div className="text-gray-600 mt-1 text-sm lg:text-base">
                                            <span className="font-semibold">Catégorie: </span>{answer.category}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 italic text-sm lg:text-base">Aucune réponse pour cette catégorie.</div>
                    )}
                </div>

                <div className="mt-4 lg:mt-6 text-center space-x-2 lg:space-x-3">
                    <button 
                        onClick={handleConfirm}
                        className="px-4 lg:px-6 py-1 lg:py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors text-sm lg:text-base"
                    >
                        Confirmer
                    </button>
                    <button 
                        onClick={() => setShowConfirmationPopup(false)}
                        className="px-4 lg:px-6 py-1 lg:py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors text-sm lg:text-base"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationPopup 