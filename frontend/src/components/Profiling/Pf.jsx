import React, { useState, useContext, useEffect } from 'react'
import { useLoading } from './LoadingContext'
import PfSkeleton from './PfSkeleton'
import { UserContext } from '../Context/UserContext.jsx'

const Pf = () => {
    const { updateStepAnswers } = useContext(UserContext)
    const [pfAnswers, setPfAnswers] = useState([])
    const { isLoading } = useLoading()

    const handleSelectChange = (questionIndex, value) => {
        if (value === "") return // Don't log placeholder selection
        
        setPfAnswers(prev => {
            const newAnswers = [...prev]
            newAnswers[questionIndex] = {
                q: lstquestion[questionIndex].question,
                answer: value
            }
            console.log("PF Select Answer:", {
                question: lstquestion[questionIndex].question,
                answer: value,
                allAnswers: newAnswers
            })
            return newAnswers
        })
    }

    const handleCheckboxChange = (questionIndex, optionValue, checked) => {
        setPfAnswers(prev => {
            const newAnswers = [...prev]
            if (!newAnswers[questionIndex]) {
                newAnswers[questionIndex] = {
                    q: lstquestion[questionIndex].question,
                    answer: []
                }
            }
            
            // Ensure answer is always an array for checkbox questions
            if (!Array.isArray(newAnswers[questionIndex].answer)) {
                newAnswers[questionIndex].answer = []
            }
            
            if (checked) {
                // Only add if not already present
                if (!newAnswers[questionIndex].answer.includes(optionValue)) {
                    newAnswers[questionIndex].answer.push(optionValue)
                }
            } else {
                newAnswers[questionIndex].answer = newAnswers[questionIndex].answer.filter(
                    item => item !== optionValue
                )
            }
            
            console.log("PF Checkbox Answer:", {
                question: lstquestion[questionIndex].question,
                selectedOptions: newAnswers[questionIndex].answer,
                allAnswers: newAnswers
            })
            return newAnswers
        })
    }

    useEffect(() => {
        // Filter out empty answers and update step answers
        const validAnswers = (pfAnswers || [])
            .filter((answer) => !!answer && typeof answer === 'object')
            .filter((answer) => {
            if (!answer.q) return false;
            if (Array.isArray(answer.answer)) {
                return answer.answer.length > 0;
            }
                return answer.answer !== undefined && answer.answer !== null && answer.answer !== "";
        });
        updateStepAnswers(2, validAnswers) // Step 2 for PF
        console.log("PF All Answers Updated:", validAnswers)
    }, [pfAnswers, updateStepAnswers])

  const lstquestion = [
    {
      question : "Quelle est votre tranche de revenus mensuels ?",
      options : [
        {
          label : "moin de 3000 MAD",
          value : "under_3000"
        },
        {
          label:"3000 MAD – 6000 MAD",
          value : "3000_6000"
        },
        {
          label : "plus de 6000 MAD",
          value : "over_6000"
        }
      ]
        },
    {
      question:"Épargnez-vous actuellement ?",
      options : [
        {
          label : "Jamais",
          value : "never"
        },
        {
          label : "Occasionnellement",
          value : "occasionally"
        },
        {
          label : "Régulièrement",
          value : "regularly"
        },
        {
          label : "Automatiquement",
          value : "automatically"
        }
      ],
    },
    {
            question : "Sur quelle durée principale souhaitez-vous placer votre argent ?",
            options : [
        {
          label : "Court terme (0–2 ans : voyage, imprévu, voiture…)",
          value : "short_term"
        },
        {
          label : "Moyen terme (3–7 ans : projet immobilier, études enfants…)",
          value : "medium_term"
        },
        {
          label : "Long terme (8 ans et + : retraite, transmission de patrimoine)",
          value : "long_term"
        }
      ]
    },
    {
            question : "Quels sont vos objectifs prioritaires d'épargne ?",
      type : "checkbox",
      options : [
        {
          label : "Acquisition immobilière",
          value : "property_acquisition"
                },
        {
          label : "Préparation de la retraite",
          value : "retirement_preparation"
        },
        {
                    label : "Constitution d'un fonds de sécurité (épargne de précaution)",
          value : "fund_construction"
        },
        {
          label : "Financement des études de mes enfants",
          value : "child_education_financing"
        },
        {
          label : "Réalisation de projets personnels (voyage, mariage, voiture…)",
          value : "personal_project_realization"
        },
        {
          label : "Transmission de patrimoine",
          value : "patrimony_transmission"
        }
      ]
    }
  ]

    if (isLoading) {
        return <PfSkeleton />
    }

  return (
    <div className="p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 mt-2 rounded-xl shadow-lg bg-gray-800/30 border border-gray-700/50 backdrop-blur-sm">
      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
        {lstquestion.map((question, index) => (
          <React.Fragment key={`question-${index}`}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between w-full gap-3 sm:gap-4 lg:gap-6">
              {/* Question Label */}
              <div className="w-full lg:w-5/12 xl:w-1/2">
                <label className="text-gray-50 text-xs sm:text-sm md:text-base lg:text-lg font-medium leading-relaxed block">
                  {question.question}
                </label>
              </div>

              {/* Answer Options */}
              <div className="w-full lg:w-7/12 xl:w-1/2">
                {question.type === "checkbox" ? (
                  <div className="flex flex-col items-start gap-2 sm:gap-2">
                    {question.options.map((option, optionIndex) => (
                      <label 
                        key={`checkbox-${index}-${optionIndex}`} 
                        className="flex items-start gap-1.5 sm:gap-2 cursor-pointer hover:bg-gray-700/40 p-1.5 sm:p-2 rounded-lg transition-all duration-200 group border border-transparent hover:border-gray-600/50"
                      >
                        <input
                          type="checkbox"
                          name={`question-${index}`}
                          value={option.value}
                          className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 bg-gray-700 border-gray-600 focus:ring-emerald-400 focus:ring-2 flex-shrink-0 mt-0.5 rounded"
                          onChange={(e) => handleCheckboxChange(index, option.value, e.target.checked)}
                          checked={pfAnswers[index]?.answer?.includes(option.value) || false}
                          required={!(pfAnswers[index]?.answer?.length > 0)}
                        />
                        <span className="text-gray-100 text-xs sm:text-sm lg:text-base leading-relaxed group-hover:text-white transition-colors">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="w-full">
                    <select 
                      className="w-full font-medium rounded-lg border border-gray-600 bg-gray-700/50 hover:bg-gray-700/70 focus:bg-gray-700 p-2 sm:p-3 text-xs sm:text-sm lg:text-base text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                      onChange={(e) => handleSelectChange(index, e.target.value)}
                      value={pfAnswers[index]?.answer || ""}
                      required
                    >
                      <option className='text-gray-400 bg-gray-800' value="">
                        Sélectionnez une option
                      </option>
                      {question.options.map((option, optionIndex) => (
                        <option 
                          key={`option-${index}-${optionIndex}`} 
                          className="bg-gray-800 text-gray-100 py-2" 
                          value={option.label}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            {/* Separator */}
            {index !== lstquestion.length - 1 && (
              <div className="w-full">
                <hr className='border-t border-gray-600/50 mt-3 sm:mt-4 lg:mt-6 opacity-60' />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default Pf
