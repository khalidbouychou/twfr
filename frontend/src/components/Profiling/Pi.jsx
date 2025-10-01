import React, { useState, useContext, useEffect } from 'react'
import { useLoading } from './LoadingContext'
import PiSkeleton from './PiSkeleton'
import { UserContext } from '../Context/UserContext.jsx'

const Pi = () => {
    const { updateStepAnswers, stepAnswers } = useContext(UserContext)
    const [piAnswers, setPiAnswers] = useState(() => {
        // Initialize from stepAnswers on mount
        return (stepAnswers && stepAnswers[3]) ? stepAnswers[3] : []
    })
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

    // Only initialize once when component mounts with saved data
    useEffect(() => {
        const savedAnswers = stepAnswers && stepAnswers[3] ? stepAnswers[3] : []
        if (savedAnswers.length > 0 && piAnswers.length === 0) {
            setPiAnswers(savedAnswers)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
        
        const prevForStep = stepAnswers && stepAnswers[3] ? stepAnswers[3] : []
        const isSame = JSON.stringify(prevForStep) === JSON.stringify(validAnswers)
        if (!isSame) {
            updateStepAnswers(3, validAnswers) // Step 3 for PI
            console.log("PI All Answers Updated:", validAnswers)
        }
    }, [piAnswers, stepAnswers, updateStepAnswers])

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
    <div className="w-full">
      <div className="space-y-4">
        {lstquestion.map((question, index) => (
          <div key={`question-${index}`} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
            <label className="block text-white font-light text-sm mb-3">
              {question.question}
            </label>

            {question.type === "checkbox" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {question.options.map((option, optionIndex) => (
                  <div key={`checkbox-${index}-${optionIndex}`} className="w-full">
                    <label className="flex items-start gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#3CD4AB] hover:bg-white/10 cursor-pointer transition-all duration-200 group">
                      <input
                        type="checkbox"
                        name={`question-${index}`}
                        value={option.value}
                        checked={selectedOptions[index]?.[option.value] || false}
                        onChange={(e) => handleCheckboxChange(index, option.value, e.target.checked)}
                        className="w-4 h-4 text-[#3CD4AB] bg-gray-700 border-gray-600 focus:ring-[#3CD4AB] focus:ring-2 flex-shrink-0 mt-0.5 rounded"
                        required={!(piAnswers[index]?.answer?.length > 0)}
                      />
                      <span className="text-white/90 font-light text-sm leading-relaxed group-hover:text-white transition-colors">
                        {option.label}
                      </span>
                    </label>
                    {option.value === "Autres" && selectedOptions[index]?.[option.value] && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Précisez votre réponse..."
                          value={otherInputs[index] || ""}
                          onChange={(e) => handleOtherInputChange(index, e.target.value)}
                          className="w-full font-light rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 focus:bg-white/10 p-2 text-xs text-white/90 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CD4AB] focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                    )}
                    {option.value === "Non" && selectedOptions[index]?.[option.value] && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Précisez votre réponse..."
                          value={otherInputs[index] || ""}
                          onChange={(e) => handleOtherInputChange(index, e.target.value)}
                          className="w-full font-light rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 focus:bg-white/10 p-2 text-xs text-white/90 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CD4AB] focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : question.type === "radio" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {question.options.map((option, optionIndex) => (
                  <label 
                    key={`radio-${index}-${optionIndex}`} 
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#3CD4AB] hover:bg-white/10 cursor-pointer transition-all duration-200 group"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option.label}
                      className="w-4 h-4 text-[#3CD4AB] bg-gray-700 border-gray-600 focus:ring-[#3CD4AB] focus:ring-2 flex-shrink-0"
                      onChange={() => handleRadioChange(index, option.label)}
                      checked={piAnswers[index]?.answer === option.label}
                      required
                    />
                    <span className="text-white/90 font-light text-sm group-hover:text-white transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <select 
                className="w-full font-light rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 focus:bg-white/10 p-2.5 text-sm text-white/90 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3CD4AB] focus:border-transparent transition-all duration-300 appearance-none cursor-pointer"
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
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pi
