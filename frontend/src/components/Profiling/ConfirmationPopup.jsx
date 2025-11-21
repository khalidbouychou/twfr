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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl max-h-[90%] overflow-y-auto w-full max-w-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16  flex items-center justify-center mx-auto mb-4">
                            {/* <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg> */}
                        <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="#3CD4AB"><path d="M294-242 70-466l43-43 181 181 43 43-43 43Zm170 0L240-466l43-43 181 181 384-384 43 43-427 427Zm0-170-43-43 257-257 43 43-257 257Z"/></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil validé !</h2>
                        <p className="text-gray-500">
                            Nous avons analysé vos réponses. Voici une sélection de produits adaptés à votre profil.
                        </p>
                    </div>

                    {recommendationResults && Array.isArray(recommendationResults.matchedProducts) && recommendationResults.matchedProducts.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Recommandations</h3>
                            <div className="space-y-3">
                                {recommendationResults.matchedProducts.slice(0, 4).map((p, idx) => (
                                    <div key={p.id || idx} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                                        <img src={p.avatar} alt={p.nom_produit} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 truncate">{p.nom_produit}</h4>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                                                <span>Risque: <span className="font-medium text-gray-700">{p.risque}/7</span></span>
                                                <span>•</span>
                                                <span>ROI: <span className="font-medium text-gray-700">{(p.rendement_annuel_moyen ?? p.roi_annuel ?? 5)}%</span></span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-emerald-600">{Math.round(p.overallCompatibility)}%</div>
                                            <div className="text-xs text-emerald-600 font-medium">Compatibilité</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleGoToDashboard}
                        className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                    >
                        Accéder à mon tableau de bord
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-h-[90%] flex flex-col w-full max-w-5xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Vérification</h2>
                        <p className="text-sm text-gray-500 mt-1">Confirmez vos informations avant de continuer</p>
                    </div>
                    <button 
                        onClick={() => setShowConfirmationPopup(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Sidebar / Tabs */}
                    <div className="w-full md:w-64 bg-gray-50 p-4 overflow-x-auto md:overflow-y-auto border-b md:border-b-0 md:border-r border-gray-100 flex-shrink-0">
                        <div className="flex md:flex-col gap-2">
                            {[0,1,2,3,4].map((idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveStep(idx)}
                                    className={`px-4 py-3 rounded-lg text-left text-sm font-medium transition-all whitespace-nowrap ${
                                        activeStep === idx 
                                        ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-gray-200' 
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                    }`}
                                >
                                    {stepNames[idx]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Answers */}
                    <div className="flex-1 p-6 overflow-y-auto bg-white">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                            {stepNames[activeStep]}
                        </h3>

                        {Array.isArray(answersByStep[activeStep]) && answersByStep[activeStep].length > 0 ? (
                            <div className="space-y-6">
                                {answersByStep[activeStep].map((answer, i) => (
                                    <div key={i} className="group">
                                        <div className="text-sm text-gray-500 mb-1.5">{answer.q}</div>
                                        <div className="text-gray-900 font-medium">
                                            {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                <p>Aucune information pour cette section</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button 
                        onClick={() => setShowConfirmationPopup(false)}
                        className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Modifier
                    </button>
                    <button 
                        onClick={handleConfirm}
                        className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                        Confirmer et analyser
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationPopup 