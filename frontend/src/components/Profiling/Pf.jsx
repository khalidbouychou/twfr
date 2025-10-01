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
    <div className="w-full bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-xl">
      <div className="space-y-6">
        {lstquestion.map((question, index) => (
          <React.Fragment key={`question-${index}`}>
            <div className="flex flex-col lg:flex-row lg:items-start w-full gap-4 lg:gap-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
              {/* Question Label */}
              <div className="w-full lg:w-2/5">
                <label className="text-gray-100 text-base sm:text-lg font-medium leading-relaxed block">
                  {question.question}
                </label>
              </div>

              {/* Answer Options */}
              <div className="w-full lg:w-3/5">
                {question.type === "checkbox" ? (
                  <div className="flex flex-col items-start gap-3">
                    {question.options.map((option, optionIndex) => (
                      <label 
                        key={`checkbox-${index}-${optionIndex}`} 
                        className="flex items-start gap-3 cursor-pointer hover:bg-gray-700/40 p-3 rounded-xl transition-all duration-300 group border border-gray-700/30 hover:border-[#3CD4AB]/50 w-full"
                      >
                        <input
                          type="checkbox"
                          name={`question-${index}`}
                          value={option.value}
                          className="w-5 h-5 text-[#3CD4AB] bg-gray-700 border-gray-600 focus:ring-[#3CD4AB] focus:ring-2 flex-shrink-0 mt-0.5 rounded"
                          onChange={(e) => handleCheckboxChange(index, option.value, e.target.checked)}
                          checked={pfAnswers[index]?.answer?.includes(option.value) || false}
                          required={!(pfAnswers[index]?.answer?.length > 0)}
                        />
                        <span className="text-gray-200 text-sm sm:text-base leading-relaxed group-hover:text-white transition-colors">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="w-full">
                    <select 
                      className="w-full font-medium rounded-xl border border-gray-600/50 bg-gray-700/50 hover:bg-gray-700/70 focus:bg-gray-700 p-3.5 sm:p-4 text-base text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CD4AB] focus:border-transparent transition-all duration-300 appearance-none cursor-pointer shadow-sm"
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
            
        
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default Pf
