import React, { useContext, useState, useMemo, useEffect } from 'react'
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
    const [showAlternativeScenarios, setShowAlternativeScenarios] = useState(false)

    // Reset old data when component unmounts or popup closes
    useEffect(() => {
        return () => {
            if (!showConfirmationPopup) {
                // Cleanup on close
                setShowThankYou(false)
                setShowAlternativeScenarios(false)
            }
        }
    }, [showConfirmationPopup])

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

    // Function to completely reset profile data
    const resetProfileData = () => {
        console.log('🔄 Resetting profile data...')
        
        // Clear all localStorage items related to profile
        localStorage.removeItem('userAnswers')
        localStorage.removeItem('userResults')
        localStorage.removeItem('recommendationResults')
        localStorage.removeItem('stepAnswers')
        
        // Reset component state
        setRecommendationResults(null)
        setShowThankYou(false)
        setShowAlternativeScenarios(false)
        setActiveStep(0)
        
        console.log('✅ Profile data cleared')
    }

    // Function to regenerate recommendations with current answers
    const regenerateRecommendations = () => {
        console.log('🔄 Regenerating recommendations...')
        
        // Clear old data first
        resetProfileData()
        
        // Generate new recommendations
        try {
            const engine = new RecommendationEngine()
            const results = engine.generateCompleteRecommendation(userAnswers)
            
            // Save new results
            localStorage.setItem('userAnswers', JSON.stringify(userAnswers))
            localStorage.setItem('userResults', JSON.stringify(results))
            localStorage.setItem('recommendationResults', JSON.stringify(results))
            
            // Update state
            setRecommendationResults(results)
            
            console.log('✅ New recommendations generated:', {
                totalProducts: results.matchedProducts?.length || 0,
                timestamp: new Date().toISOString()
            })
            
            return results
        } catch (e) {
            console.error('❌ Regeneration failed:', e)
            return null
        }
    }

    const handleConfirm = () => {
        console.log('🔄 Starting new profile confirmation...')
        
        // Clear old profile data before generating new recommendations
        resetProfileData()
        
        // Save new user answers
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers))
        
        try {
            const engine = new RecommendationEngine()
            const results = engine.generateCompleteRecommendation(userAnswers)
            
            // Save new results
            localStorage.setItem('userResults', JSON.stringify(results))
            localStorage.setItem('recommendationResults', JSON.stringify(results))
            
            // Update state with fresh data
            setRecommendationResults(results)
            
            console.log('✅ New profile data generated:', {
                totalProducts: results.matchedProducts?.length || 0,
                topProduct: results.matchedProducts?.[0]?.nom_produit || 'N/A',
                timestamp: new Date().toISOString()
            })
        } catch (e) {
            console.error('❌ Recommendation generation failed:', e)
            setRecommendationResults(null)
        }
        
        setShowThankYou(true)
    }

    const handleGoToDashboard = () => {
        window.location.href = '/dashboard'
    }

    // Generate allocation data from recommendations - DYNAMIC and REACTIVE
    const allocationData = useMemo(() => {
        if (!recommendationResults?.matchedProducts || recommendationResults.matchedProducts.length === 0) {
            return []
        }

        const topProducts = recommendationResults.matchedProducts.slice(0, 5)
        const totalCompatibility = topProducts.reduce((sum, p) => sum + (p.overallCompatibility || 0), 0)
        
        return topProducts.map(p => ({
            name: p.nom_produit,
            percentage: totalCompatibility > 0 ? Math.round((p.overallCompatibility / totalCompatibility) * 100) : 0,
            compatibility: Math.round(p.overallCompatibility || 0),
            risk: p.risque || 0,
            roi: p.rendement_annuel_moyen ?? p.roi_annuel ?? 0,
            avatar: p.avatar
        }))
    }, [recommendationResults])

    // Generate 5 alternative scenarios - DYNAMIC and REACTIVE
    const alternativeScenarios = useMemo(() => {
        if (!recommendationResults?.matchedProducts) return []
        
        const allProducts = recommendationResults.matchedProducts
        const scenarios = []
        
        // Scenario 1: Conservative (low risk)
        const conservative = allProducts
            .filter(p => p.risque <= 3)
            .sort((a, b) => b.overallCompatibility - a.overallCompatibility)
            .slice(0, 3)
        if (conservative.length > 0) {
            scenarios.push({
                name: "Conservateur",
                description: "Privilégie la sécurité",
                products: conservative
            })
        }

        // Scenario 2: Balanced
        const balanced = allProducts
            .filter(p => p.risque >= 3 && p.risque <= 5)
            .sort((a, b) => b.overallCompatibility - a.overallCompatibility)
            .slice(0, 3)
        if (balanced.length > 0) {
            scenarios.push({
                name: "Équilibré",
                description: "Mix risque/rendement",
                products: balanced
            })
        }

        // Scenario 3: Growth (higher risk/return)
        const growth = allProducts
            .filter(p => p.risque >= 5)
            .sort((a, b) => b.overallCompatibility - a.overallCompatibility)
            .slice(0, 3)
        if (growth.length > 0) {
            scenarios.push({
                name: "Croissance",
                description: "Maximise le rendement",
                products: growth
            })
        }

        // Scenario 4: ESG focused
        const esg = allProducts
            .filter(p => p.esg_score >= 7)
            .sort((a, b) => b.overallCompatibility - a.overallCompatibility)
            .slice(0, 3)
        if (esg.length > 0) {
            scenarios.push({
                name: "ESG",
                description: "Investissement responsable",
                products: esg
            })
        }

        // Scenario 5: High liquidity
        const liquid = allProducts
            .filter(p => p.liquidite_score >= 7)
            .sort((a, b) => b.overallCompatibility - a.overallCompatibility)
            .slice(0, 3)
        if (liquid.length > 0) {
            scenarios.push({
                name: "Liquidité",
                description: "Accès rapide aux fonds",
                products: liquid
            })
        }

        return scenarios.slice(0, 5)
    }, [recommendationResults])

    if (!showConfirmationPopup) return null

    // Simple Pie Chart Component
    const PieChart = ({ data }) => {
        if (!data || data.length === 0) return null

        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899']
        let currentAngle = 0

        return (
            <div className="flex flex-col items-center gap-4">
                <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                    {data.map((item, index) => {
                        const percentage = item.percentage
                        const angle = (percentage / 100) * 360
                        const radius = 80
                        const centerX = 100
                        const centerY = 100

                        const startAngle = currentAngle
                        const endAngle = currentAngle + angle
                        currentAngle = endAngle

                        const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
                        const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
                        const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
                        const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180)

                        const largeArc = angle > 180 ? 1 : 0

                        const pathData = [
                            `M ${centerX} ${centerY}`,
                            `L ${startX} ${startY}`,
                            `A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`,
                            'Z'
                        ].join(' ')

                        return (
                            <path
                                key={index}
                                d={pathData}
                                fill={colors[index % colors.length]}
                                stroke="white"
                                strokeWidth="2"
                            />
                        )
                    })}
                </svg>

                <div className="w-full space-y-2">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div 
                                className="w-4 h-4 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: colors[index % colors.length] }}
                            />
                            <span className="text-gray-700 flex-1 truncate">{item.name}</span>
                            <span className="font-semibold text-gray-900">{item.percentage}%</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // Thank you popup with new design
    if (showThankYou) {
        return (
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] p-4">
                <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Profil enregistré !</h2>
                                <p className="text-emerald-50 text-sm">Voici vos recommandations personnalisées</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Allocation Chart Section */}
                        {allocationData.length > 0 && (
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Allocation personnalisée</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="flex justify-center">
                                        <PieChart data={allocationData} />
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-600 mb-4">Répartition recommandée basée sur votre profil</p>
                                        {allocationData.map((item, idx) => (
                                            <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    {item.avatar && (
                                                        <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded object-cover" />
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-800 text-sm">{item.name}</div>
                                                        <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                                            <span>Risque: {item.risk}/7</span>
                                                            <span>ROI: {item.roi}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-emerald-600">{item.percentage}%</div>
                                                        <div className="text-xs text-gray-500">{item.compatibility}% match</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Product Match Section */}
                        {recommendationResults && Array.isArray(recommendationResults.matchedProducts) && recommendationResults.matchedProducts.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Compatibilité profil-produit</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {recommendationResults.matchedProducts.slice(0, 6).map((p, idx) => (
                                        <div key={p.id || idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start gap-3 mb-3">
                                                <img src={p.avatar} alt={p.nom_produit} className="w-12 h-12 rounded object-cover" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-gray-800 text-sm line-clamp-2">{p.nom_produit}</div>
                                                </div>
                                            </div>
                                            
                                            {/* Compatibility Bar */}
                                            <div className="mb-2">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-gray-600">Compatibilité</span>
                                                    <span className="font-semibold text-emerald-600">{Math.round(p.overallCompatibility)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-emerald-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${Math.round(p.overallCompatibility)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Risque: {p.risque}/7</span>
                                                <span>ROI: {(p.rendement_annuel_moyen ?? p.roi_annuel ?? 5)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Alternative Scenarios Button */}
                        {alternativeScenarios.length > 0 && (
                            <div>
                                <button 
                                    onClick={() => setShowAlternativeScenarios(!showAlternativeScenarios)}
                                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    {showAlternativeScenarios ? 'Masquer' : 'Afficher'} {alternativeScenarios.length} scénarios alternatifs
                                </button>

                                {/* Alternative Scenarios List */}
                                {showAlternativeScenarios && (
                                    <div className="mt-4 space-y-4">
                                        {alternativeScenarios.map((scenario, idx) => (
                                            <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="mb-3">
                                                    <h4 className="font-semibold text-gray-800">{scenario.name}</h4>
                                                    <p className="text-sm text-gray-600">{scenario.description}</p>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                    {scenario.products.map((p, pidx) => (
                                                        <div key={pidx} className="bg-white rounded p-2 text-xs border border-gray-200">
                                                            <div className="font-medium text-gray-800 truncate">{p.nom_produit}</div>
                                                            <div className="text-gray-500 mt-1">
                                                                <div>Match: {Math.round(p.overallCompatibility)}%</div>
                                                                <div>Risque: {p.risque}/7</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <div className="flex gap-3">
                            <button 
                                onClick={regenerateRecommendations}
                                className="px-6 py-3 bg-white border-2 border-emerald-500 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Régénérer
                            </button>
                            <button 
                                onClick={handleGoToDashboard}
                                className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors shadow-md"
                            >
                                Aller au dashboard
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-3">
                            Les données sont automatiquement réinitialisées à chaque nouvelle génération
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] p-4">
            <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
                    <h2 className="text-2xl font-bold">Récapitulatif de vos réponses</h2>
                    <p className="text-emerald-50 text-sm mt-1">Vérifiez vos informations avant de continuer</p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Category menu */}
                    <div className="mb-6 overflow-x-auto">
                        <div className="flex gap-2 pb-2 min-w-max">
                            {[0,1,2,3,4].map((idx) => (
                                <button
                                    key={idx}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                        activeStep === idx 
                                            ? 'bg-emerald-500 text-white shadow-md' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                    onClick={() => setActiveStep(idx)}
                                >
                                    {stepNames[idx]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Answers list for active category */}
                    <div>
                        <h3 className="text-emerald-600 font-semibold text-lg mb-4 pb-2 border-b-2 border-emerald-500">
                            {stepNames[activeStep]}
                        </h3>

                        {Array.isArray(answersByStep[activeStep]) && answersByStep[activeStep].length > 0 ? (
                            <div className="space-y-3">
                                {answersByStep[activeStep].map((answer, i) => (
                                    <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="text-gray-800 text-sm mb-2">
                                            <span className="font-semibold text-gray-900">Question:</span> {answer.q}
                                        </div>
                                        <div className="text-gray-700 text-sm">
                                            <span className="font-semibold text-gray-900">Réponse:</span>{' '}
                                            <span className="text-emerald-600 font-medium">
                                                {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
                                            </span>
                                        </div>
                                        {answer.category && (
                                            <div className="text-gray-600 text-sm mt-2">
                                                <span className="font-semibold">Catégorie:</span> {answer.category}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500 italic">Aucune réponse pour cette catégorie</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
                    <button 
                        onClick={() => setShowConfirmationPopup(false)}
                        className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Fermer
                    </button>
                    <button 
                        onClick={handleConfirm}
                        className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors shadow-md"
                    >
                        Confirmer et voir les recommandations
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationPopup 