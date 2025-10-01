import React, { useState, useContext, useEffect } from 'react'
import { useLoading } from './LoadingContext'
import PfSkeleton from './PfSkeleton'
import { UserContext } from '../Context/UserContext.jsx'

const Pf = () => {
    const { updateStepAnswers, stepAnswers } = useContext(UserContext)
    const [pfAnswers, setPfAnswers] = useState(() => {
        // Initialize from stepAnswers on mount
        return (stepAnswers && stepAnswers[2]) ? stepAnswers[2] : []
    })
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

    // Only initialize once when component mounts with saved data
    useEffect(() => {
        const savedAnswers = stepAnswers && stepAnswers[2] ? stepAnswers[2] : []
        if (savedAnswers.length > 0 && pfAnswers.length === 0) {
            setPfAnswers(savedAnswers)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
        
        const prevForStep = stepAnswers && stepAnswers[2] ? stepAnswers[2] : []
        const isSame = JSON.stringify(prevForStep) === JSON.stringify(validAnswers)
        if (!isSame) {
            updateStepAnswers(2, validAnswers) // Step 2 for PF
            console.log("PF All Answers Updated:", validAnswers)
        }
    }, [pfAnswers, stepAnswers, updateStepAnswers])

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
    <div className="w-full">
      <div className="space-y-4">
        {lstquestion.map((question, index) => (
          <div key={`question-${index}`} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
            <label className="block text-white font-light text-sm mb-3">
              {question.question}
            </label>

            {question.type === "checkbox" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {question.options.map((option, optionIndex) => (
                  <label 
                    key={`checkbox-${index}-${optionIndex}`} 
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#3CD4AB] hover:bg-white/10 cursor-pointer transition-all duration-200 group"
                  >
                    <input
                      type="checkbox"
                      name={`question-${index}`}
                      value={option.value}
                      className="w-4 h-4 text-[#3CD4AB] bg-gray-700 border-gray-600 focus:ring-[#3CD4AB] focus:ring-2 flex-shrink-0 mt-0.5 rounded"
                      onChange={(e) => handleCheckboxChange(index, option.value, e.target.checked)}
                      checked={pfAnswers[index]?.answer?.includes(option.value) || false}
                      required={!(pfAnswers[index]?.answer?.length > 0)}
                    />
                    <span className="text-white/90 font-light text-sm leading-relaxed group-hover:text-white transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <select 
                className="w-full font-light rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 focus:bg-white/10 p-2.5 text-sm text-white/90 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CD4AB] focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
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
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pf
