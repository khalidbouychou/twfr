import React, { useState, useContext, useEffect } from 'react'
import { useLoading } from './LoadingContext'
import EsgSkeleton from './EsgSkeleton'
import { UserContext } from '../Context/UserContext.jsx'

const Esg = () => {
    const { updateStepAnswers } = useContext(UserContext)
    const [esgAnswers, setEsgAnswers] = useState({})
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

    useEffect(() => {
        // Filter out empty answers and update step answers
        const validAnswers = Object.values(esgAnswers).filter(answer => answer.q && answer.answer)
        updateStepAnswers(4, validAnswers) // Step 4 for ESG
        console.log("ESG All Answers Updated:", validAnswers)
    }, [esgAnswers, updateStepAnswers])

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
        <div className="p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 mt-2 rounded-xl shadow-lg bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm">
            <div className="space-y-4 sm:space-y-5 lg:space-y-8">
                {lstquestion.map((category, categoryIndex) => (
                    <div key={`category-${categoryIndex}`} className="space-y-3 sm:space-y-4 lg:space-y-6">
                        {/* Category Title */}
                        <h3 className="font-semibold text-emerald-400 mb-2 sm:mb-3 lg:mb-4 border-b-2 border-emerald-400/50 pb-1.5 sm:pb-2 text-sm sm:text-base lg:text-lg">
                            {category.title}
                        </h3>

                        {/* Questions Container */}
                        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                            {/* Q1 Questions - Select dropdowns */}
                            {category.q1.map((question, q1Index) => (
                                <div key={`q1-${categoryIndex}-${q1Index}`} className="flex flex-col lg:flex-row lg:items-start lg:justify-between w-full gap-3 sm:gap-4 lg:gap-6">
                                    {/* Question on the left */}
                                    <div className="w-full lg:w-5/12 xl:w-1/2">
                                        <p className="text-gray-50 text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed">
                                            {question.question}
                                        </p>
                                    </div>
                                    
                                    {/* Select dropdown on the right */}
                                    <div className="w-full lg:w-7/12 xl:w-1/2">
                                        <select 
                                            className="w-full font-medium rounded-lg border border-gray-600 bg-gray-700/50 hover:bg-gray-700/70 focus:bg-gray-700 p-2 sm:p-3 text-xs sm:text-sm lg:text-base text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
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
                                </div>
                            ))}
                            
                            {/* Q2 Questions - Select dropdowns */}
                            {category.q2.map((question, q2Index) => (
                                <div key={`q2-${categoryIndex}-${q2Index}`} className="flex flex-col lg:flex-row lg:items-start lg:justify-between w-full gap-3 sm:gap-4 lg:gap-6">
                                    {/* Question on the left */}
                                    <div className="w-full lg:w-5/12 xl:w-1/2">
                                        <p className="text-gray-50 text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed">
                                            {question.question}
                                        </p>
                                    </div>
                                    
                                    {/* Select dropdown on the right */}
                                    <div className="w-full lg:w-7/12 xl:w-1/2">
                                        <select 
                                            className="w-full font-medium rounded-lg border border-gray-600 bg-gray-700/50 hover:bg-gray-700/70 focus:bg-gray-700 p-2 sm:p-3 text-xs sm:text-sm lg:text-base text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
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
                                </div>
                            ))}
                        </div>

                        {/* Category Separator */}
                        {categoryIndex !== lstquestion.length - 1 && (
                            <div className="w-full">
                                <hr className='border-t border-gray-600/50 mt-4 sm:mt-6 lg:mt-8 opacity-60' />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Esg
