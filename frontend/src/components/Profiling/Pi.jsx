import React, { useState, useContext, useEffect } from 'react'
import { useLoading } from './LoadingContext'
import PiSkeleton from './PiSkeleton'
import { UserContext } from '../Context/UserContext.jsx'

const Pi = () => {
    const { updateStepAnswers } = useContext(UserContext)
    const [piAnswers, setPiAnswers] = useState([])
    const { isLoading } = useLoading()
  const [selectedOptions, setSelectedOptions] = useState({});
  const [otherInputs, setOtherInputs] = useState({});

  const handleCheckboxChange = (questionIndex, optionValue, checked) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionIndex]: {
        ...prev[questionIndex],
        [optionValue]: checked
      }
    }));

        // Update piAnswers
        setPiAnswers(prev => {
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
            
            console.log("PI Checkbox Answer:", {
                question: lstquestion[questionIndex].question,
                selectedOptions: newAnswers[questionIndex].answer,
                allAnswers: newAnswers
            })
            return newAnswers
        });

    // If "Autres" is unchecked, clear the input
    if (optionValue === "Autres" && !checked) {
      setOtherInputs(prev => ({
        ...prev,
        [questionIndex]: ""
      }));
    }
  };

  const handleOtherInputChange = (questionIndex, value) => {
    setOtherInputs(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

    const handleSelectChange = (questionIndex, value) => {
        if (value === "") return // Don't log placeholder selection
        
        setPiAnswers(prev => {
            const newAnswers = [...prev]
            newAnswers[questionIndex] = {
                q: lstquestion[questionIndex].question,
                answer: value
            }
            console.log("PI Select Answer:", {
                question: lstquestion[questionIndex].question,
                answer: value,
                allAnswers: newAnswers
            })
            return newAnswers
        })
    }

    const handleRadioChange = (questionIndex, value) => {
        setPiAnswers(prev => {
            const newAnswers = [...prev]
            newAnswers[questionIndex] = {
                q: lstquestion[questionIndex].question,
                answer: value
            }
            console.log("PI Radio Answer:", {
                question: lstquestion[questionIndex].question,
                answer: value,
                allAnswers: newAnswers
            })
            return newAnswers
        })
    }

    useEffect(() => {
        // Filter out empty answers and update step answers
        const validAnswers = piAnswers.filter(answer => {
            if (!answer.q) return false;
            // Handle both string and array answers
            if (Array.isArray(answer.answer)) {
                return answer.answer.length > 0;
            }
            return answer.answer && answer.answer !== "";
        });
        updateStepAnswers(3, validAnswers) // Step 3 for PI
        console.log("PI All Answers Updated:", validAnswers)
    }, [piAnswers, updateStepAnswers])

  const lstquestion = [
    {
            question : "Avez-vous déjà investi dans l'un des produits suivants ?",
      type : "checkbox",
      options : [
        {
          label : "Immobilier",
          value : "immobilier",
        },
        {
          label : "Actions en bourse",
          value : "actions_bourse"
        },
        {
          label : "Obligations",
          value : "obligations"
        },
        {
          label : "OPCVM/fonds d'investissement",
          value : "opcvm_fonds_investissement"
        },
        {
          label : "Autres",
          value : "Autres",
        },
        {
          label : "Non",
          value : "Non",
        }
      ]
    },
    {
      question : "Comment réagissez-vous face aux baisses soudaines des marchés financiers ?",
      type : "radio",
      options : [
        {
          label : "Je panique facilement",
          value : "je_panique_facilement"
        },
        {
                    label : "J'essaie de rester rationnel",
          value : "j_essaie_de_rester_rationnel"
        },
        {
          label : "Je vois cela comme une opportunité",
          value : "je_vois_cela_comme_une_opportunite"
        }
      ]
    },
    {
            question : "Sur quels critères prenez-vous vos décisions d'investissement ?",
      options : [
        {
          label : "Mes recherches personnelles",
          value : "mes_recherches_personnelles"
        },
        {
                    label : "Les conseils de mon entourage / d'un conseiller financier",
          value : "les_conseils_de_mon_entourage_d_un_conseiller_financiers"
        },
        {
          label : "Les tendances du marché et actualités économiques",
          value : "les_tendances_du_marche_et_actualites_economiques"
        },
        {
          label : "Un mélange de plusieurs facteurs",
          value : "un_melange_de_plusieurs_facteurs"
        }
      ]
    },
    {
      question : "À quelle fréquence suivez-vous vos investissements ?",
      options : [
        {
          label : "Quotidiennement",
          value : "quotidiennement"
        },
        {
          label : "Hebdomadairement",
          value : "hebdomadairement"
        },
        {
          label : "Mensuellement",
          value : "mensuellement"
        },
        {
          label : "Rarement / jamais",
          value : "rarement_jamais"
        }
      ]
    },
  ]

    if (isLoading) {
        return <PiSkeleton />
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
                      <div key={`checkbox-${index}-${optionIndex}`} className="w-full">
                        <label className="flex items-start gap-1.5 sm:gap-2 cursor-pointer hover:bg-gray-700/40 p-1.5 sm:p-2 rounded-lg transition-all duration-200 group border border-transparent hover:border-gray-600/50">
                          <input
                            type="checkbox"
                            name={`question-${index}`}
                            value={option.value}
                            checked={selectedOptions[index]?.[option.value] || false}
                            onChange={(e) => handleCheckboxChange(index, option.value, e.target.checked)}
                            className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 bg-gray-700 border-gray-600 focus:ring-emerald-400 focus:ring-2 flex-shrink-0 mt-0.5 rounded"
                            required={!(piAnswers[index]?.answer?.length > 0)}
                          />
                          <span className="text-gray-100 text-xs sm:text-sm lg:text-base group-hover:text-white transition-colors leading-relaxed">
                            {option.label}
                          </span>
                        </label>
                        {option.value === "Autres" && selectedOptions[index]?.[option.value] && (
                          <div className="ml-4 sm:ml-6 mt-1.5">
                            <input
                              type="text"
                              placeholder="Précisez votre réponse..."
                              value={otherInputs[index] || ""}
                              onChange={(e) => handleOtherInputChange(index, e.target.value)}
                              className="w-full font-medium rounded-lg border border-gray-600 bg-gray-700/50 hover:bg-gray-700/70 focus:bg-gray-700 p-2 text-xs sm:text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                        )}
                        {option.value === "Non" && selectedOptions[index]?.[option.value] && (
                          <div className="ml-4 sm:ml-6 mt-1.5">
                            <input
                              type="text"
                              placeholder="Précisez votre réponse..."
                              value={otherInputs[index] || ""}
                              onChange={(e) => handleOtherInputChange(index, e.target.value)}
                              className="w-full font-medium rounded-lg border border-gray-600 bg-gray-700/50 hover:bg-gray-700/70 focus:bg-gray-700 p-2 text-xs sm:text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : question.type === "radio" ? (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-start">
                    {question.options.map((option, optionIndex) => (
                      <label 
                        key={`radio-${index}-${optionIndex}`} 
                        className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:bg-gray-700/40 p-1.5 sm:p-2 rounded-lg transition-all duration-200 group border border-transparent hover:border-gray-600/50"
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option.label}
                          className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 bg-gray-700 border-gray-600 focus:ring-emerald-400 focus:ring-2 flex-shrink-0"
                          onChange={() => handleRadioChange(index, option.label)}
                          checked={piAnswers[index]?.answer === option.label}
                          required
                        />
                        <span className="text-gray-100 text-xs sm:text-sm lg:text-base group-hover:text-white transition-colors">
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
                      value={piAnswers[index]?.answer || ""}
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

export default Pi
