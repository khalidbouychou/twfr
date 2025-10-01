import React, { useState, useContext, useEffect } from 'react'
import { useLoading } from './LoadingContext'
import EsgSkeleton from './EsgSkeleton'
import { UserContext } from '../Context/UserContext.jsx'

const Esg = () => {
    const { updateStepAnswers, stepAnswers } = useContext(UserContext)
    const [esgAnswers, setEsgAnswers] = useState(() => {
        // Initialize from stepAnswers on mount - convert array back to object
        const savedAnswers = stepAnswers && stepAnswers[4] ? stepAnswers[4] : []
        const answersObj = {}
        savedAnswers.forEach((ans, idx) => {
            if (ans && ans.q) {
                answersObj[`saved-${idx}`] = ans
            }
        })
        return answersObj
    })
    const { isLoading } = useLoading()

    const handleSelectChange = (categoryIndex, questionType, questionIndex, value) => {
        if (value === "") return // Don't log placeholder selection
        
        const questionKey = `${categoryIndex}-${questionType}-${questionIndex}`
        const question = lstquestion[categoryIndex][questionType][questionIndex]
        
        setEsgAnswers(prev => {
            const newAnswers = { ...prev }
            newAnswers[questionKey] = {
                q: question.question,
                answer: value,
                category: lstquestion[categoryIndex].title
            }
            console.log("ESG Select Answer:", {
                category: lstquestion[categoryIndex].title,
                question: question.question,
                answer: value,
                allAnswers: newAnswers
            })
            return newAnswers
        })
    }

    // Only initialize once when component mounts with saved data
    useEffect(() => {
        const savedAnswers = stepAnswers && stepAnswers[4] ? stepAnswers[4] : []
        if (savedAnswers.length > 0 && Object.keys(esgAnswers).length === 0) {
            const answersObj = {}
            savedAnswers.forEach((ans, idx) => {
                if (ans && ans.q) {
                    answersObj[`saved-${idx}`] = ans
                }
            })
            setEsgAnswers(answersObj)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        // Filter out empty answers and update step answers
        const validAnswers = Object.values(esgAnswers).filter(answer => answer.q && answer.answer)
        
        const prevForStep = stepAnswers && stepAnswers[4] ? stepAnswers[4] : []
        const isSame = JSON.stringify(prevForStep) === JSON.stringify(validAnswers)
        if (!isSame) {
            updateStepAnswers(4, validAnswers) // Step 4 for ESG
            console.log("ESG All Answers Updated:", validAnswers)
        }
    }, [esgAnswers, stepAnswers, updateStepAnswers])

    const lstquestion = [
        {
            title : "Environnement",
            q1 : [
                {
                    question : "1 - Souhaitez-vous éviter les entreprises très polluantes ?",
                    options : [
                        {
                            label : "Oui, à exclure totalement",
                            value : "Oui, à exclure totalement"
                        },
                        {
                            label : "Indifférent",
                            value : "Indifférent"
                        },
                        {
                            label : "Je privilégie les entreprises vertes",
                            value : "Je privilégie les entreprises vertes"
                        }
                    ]
                }
            ],
            q2 : [
                {
                    question : "2 - Privilégiez-vous les entreprises engagées dans la transition énergétique ?",
                    type : "radio",
                    options : [
                        {
                            label : "Très important",
                            value : "Très important"
                        },
                        {
                            label : "Assez important",
                            value : "Assez important"
                        },
                        {
                            label : "Peu important",
                            value : "Peu important"
                        }
                    ]
                }
            ]
        },
        {
            title : "Social",
            q1 : [
                {
                    question : "1 - Accordez-vous de l'importance à la diversité et à l'inclusion ?",
                    type : "radio",
                    options : [
                        {
                            label : "Très important",
                            value : "Très important"
                        },
                        {
                            label : "Assez important",
                            value : "Assez important"
                        },
                        {
                            label : "Peu important",
                            value : "Peu important"
                        }
                    ]
                }
            ],
            q2 : [
                {
                    question : "2 - Voulez-vous soutenir les entreprises avec de bonnes conditions de travail ?",
                    type : "radio",
                    options : [
                        {
                            label : "Oui, c'est prioritaire",
                            value : "Oui, c'est prioritaire"
                        },
                        {
                            label : "Indifférent",
                            value : "Indifférent"
                        },
                        {
                            label : "Je privilégie la performance financière",
                            value : "Je privilégie la performance financière"
                        }
                    ]
                }
            ]
        },
        {
            title : "Gouvernance",
            q1 : [
                {
                    question : "1 - Voulez-vous éviter celles impliquées dans des scandales éthiques ?",
                    options : [
                        {
                            label : "Oui, exclusion automatique",
                            value : "Oui, exclusion automatique"
                        },
                        {
                            label : "Indifférent",
                            value : "Indifférent"
                        },
                        {
                            label : "Je regarde seulement la rentabilité",
                            value : "Je regarde seulement la rentabilité"
                        }
                    ]
                }
            ],
            q2 : [
                {
                    question : "2 - Préférez-vous investir dans des entreprises avec une gouvernance transparente ?",
                    options : [
                        {
                            label : "Oui, indispensable",
                            value : "Oui, indispensable"
                        },
                        {
                            label : "Souhaitable mais pas obligatoire",
                            value : "Souhaitable mais pas obligatoire"
                        },
                        {
                            label : "Pas un critère pour moi",
                            value : "Pas un critère pour moi"
                        }
                    ]
                }
            ]
        }
    ]

    if (isLoading) {
        return <EsgSkeleton />
    }

    return (
        <div className="w-full">
            <div className="space-y-6">
                {lstquestion.map((category, categoryIndex) => (
                    <div key={`category-${categoryIndex}`} className="space-y-4">
                        {/* Category Title */}
                        <div className="flex items-center gap-2 pb-2 border-b-2 border-[#3CD4AB]/50">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3CD4AB] to-[#2ba885] flex items-center justify-center shadow-lg">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-light text-white text-base sm:text-lg">
                                {category.title}
                            </h3>
                        </div>

                        {/* Questions Container */}
                        <div className="space-y-3">
                            {/* Q1 Questions */}
                            {category.q1.map((question, q1Index) => (
                                <div key={`q1-${categoryIndex}-${q1Index}`} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                                    <label className="block text-white font-light text-sm mb-3">
                                        {question.question}
                                    </label>
                                    
                                    <select 
                                        className="w-full font-light rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 focus:bg-white/10 p-2.5 text-sm text-white/90 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CD4AB] focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                                        name={`q1-${categoryIndex}-${q1Index}`}
                                        onChange={(e) => handleSelectChange(categoryIndex, 'q1', q1Index, e.target.value)}
                                        value={esgAnswers[`${categoryIndex}-q1-${q1Index}`]?.answer || ""}
                                        required
                                    >
                                        <option className='text-gray-400 bg-gray-800' value="">
                                            Sélectionnez une option
                                        </option>
                                        {question.options.map((option, optionIndex) => (
                                            <option 
                                                key={`q1-option-${categoryIndex}-${q1Index}-${optionIndex}`} 
                                                className="bg-gray-800 text-gray-100 py-2"
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                            
                            {/* Q2 Questions */}
                            {category.q2.map((question, q2Index) => (
                                <div key={`q2-${categoryIndex}-${q2Index}`} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
                                    <label className="block text-white font-light text-sm mb-3">
                                        {question.question}
                                    </label>
                                    
                                    <select 
                                        className="w-full font-light rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 focus:bg-white/10 p-2.5 text-sm text-white/90 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CD4AB] focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
                                        name={`q2-${categoryIndex}-${q2Index}`}
                                        onChange={(e) => handleSelectChange(categoryIndex, 'q2', q2Index, e.target.value)}
                                        value={esgAnswers[`${categoryIndex}-q2-${q2Index}`]?.answer || ""}
                                        required
                                    >
                                        <option className='text-gray-400 bg-gray-800' value="">
                                            Sélectionnez une option
                                        </option>
                                        {question.options.map((option, optionIndex) => (
                                            <option 
                                                key={`q2-option-${categoryIndex}-${q2Index}-${optionIndex}`} 
                                                className="bg-gray-800 text-gray-100 py-2"
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        {/* Category Separator */}
                        {categoryIndex !== lstquestion.length - 1 && (
                            <div className="w-full pt-3">
                                <hr className='border-t border-gray-600/30 opacity-60' />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Esg
