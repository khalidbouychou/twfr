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
        <div className="  rounded-lg shadow-md ">
            {lstquestion.map((category, categoryIndex) => (
                <div key={`category-${categoryIndex}`}>
                    {/* Category Title */}
                    <h3 className="font-medium text-[#3CD4AB] mb-2 border-b-2  pb-2">
                        {category.title}
                    </h3>
                    {/* Questions and Options */}
                    <div className="p-2">
                        {/* Q1 Questions - Select dropdowns */}
                        {category.q1.map((question, q1Index) => (
                            <div key={`q1-${categoryIndex}-${q1Index}`} className="flex flex-row items-start justify-between w-full gap-2 ">
                                {/* Question on the left */}
                                <div className="w-1/1">
                                    <p className="text-gray-50 leading-relaxed">
                                        {question.question}
                                    </p>
                                </div>
                                
                                {/* Select dropdown on the right */}
                                <div className="w-1/3 ">
                                    <select 
                                        className="w-full p-2 border rounded-md bg-white/80"
                                        name={`q1-${categoryIndex}-${q1Index}`}
                                        onChange={(e) => handleSelectChange(categoryIndex, 'q1', q1Index, e.target.value)}
                                        value={esgAnswers[`${categoryIndex}-q1-${q1Index}`]?.answer || ""}
                                        required
                                    >
                                        <option className='text-green-500' value="">Sélectionnez une option</option>
                                        {question.options.map((option, optionIndex) => (
                                            <option key={`q1-option-${categoryIndex}-${q1Index}-${optionIndex}`} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                        
                        {/* Q2 Questions - Select dropdowns */}
                        {category.q2.map((question, q2Index) => (
                            <div key={`q2-${categoryIndex}-${q2Index}`} className="flex flex-row items-start justify-between w-full gap-2 mt-4">
                                {/* Question on the left */}
                                <div className="w-1/1">
                                    <p className="text-gray-50 font-light leading-relaxed">
                                        {question.question}
                                    </p>
                                </div>
                                
                                {/* Select dropdown on the right */}
                                <div className="w-1/3">
                                    <select 
                                        className="w-full p-2 border rounded-md bg-white/80"
                                        name={`q2-${categoryIndex}-${q2Index}`}
                                        onChange={(e) => handleSelectChange(categoryIndex, 'q2', q2Index, e.target.value)}
                                        value={esgAnswers[`${categoryIndex}-q2-${q2Index}`]?.answer || ""}
                                        required
                                    >
                                        <option className='text-green-500' value="">Sélectionnez une option</option>
                                        {question.options.map((option, optionIndex) => (
                                            <option key={`q2-option-${categoryIndex}-${q2Index}-${optionIndex}`} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Esg
