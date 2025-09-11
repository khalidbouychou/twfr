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
        if (value === "select") return // Don't log placeholder selection
        
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
    <div className="p-2  rounded-lg shadow-md">
    {lstquestion.map((question, index) => (
                <React.Fragment key={`question-${index}`}>
                    <div className=" flex flex-row items-start justify-between w-full  mt-4">
         <label className="text-gray-50 w-1/2">{question.question}</label>
         {question.type === "checkbox" ? (
           <div className="flex flex-col items-start gap-2 w-1/2">
             {question.options.map((option, optionIndex) => (
                                    <div key={`checkbox-${index}-${optionIndex}`}>
                 <label className="flex items-center gap-4 cursor-pointer">
                   <input
                     type="checkbox"
                     name={`question-${index}`}
                     value={option.value}
                     checked={selectedOptions[index]?.[option.value] || false}
                     onChange={(e) => handleCheckboxChange(index, option.value, e.target.checked)}
                     className="w-5 h-5 text-green-50 accent-emerald-400 rounded-full"
                   />
                   <span className="text-gray-500">{option.label}</span>
                 </label>
                 {option.value === "Autres" && selectedOptions[index]?.[option.value] && (
                   <div className="ml-9 mt-2">
                     <input
                       type="text"
                       placeholder="Précisez votre réponse..."
                       value={otherInputs[index] || ""}
                       onChange={(e) => handleOtherInputChange(index, e.target.value)}
                       className="w-full font-light rounded-lg border border-gray-300 bg-gray-200 p-2 text-gray-700 placeholder-gray-500"
                     />
                   </div>
                 )}
               </div>
             ))}
           </div>
                        ) : question.type === "radio" ? (
                            <div className="flex gap-10 w-1/2 justify-start">
                                {question.options.map((option, optionIndex) => (
                                    <label key={`radio-${index}-${optionIndex}`} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={option.label}
                                            className="w-4 h-4 text-green-50 accent-emerald-400 rounded-full"
                                            onChange={() => handleRadioChange(index, option.label)}
                                            checked={piAnswers[index]?.answer === option.label}
                                        />
                                        <span className="text-gray-50">{option.label}</span>
                                    </label>
                                ))}
                            </div>
         ) : (
           <form className="w-1/2">
                                <select 
                                    className="w-full font-light rounded-lg border-none bg-white/80 p-2"
                                    onChange={(e) => handleSelectChange(index, e.target.value)}
                                    value={piAnswers[index]?.answer || "select"}
                                >
                                    <option className='text-gray-500' value="select">Sélectionnez une option</option>
               {question.options.map((option, optionIndex) => (
                                        <option key={`option-${index}-${optionIndex}`} value={option.label}>{option.label}</option>
               ))}
             </select>
           </form>
         )}
   </div>
   {index !== lstquestion.length - 1 && <hr className='border-0.5 border-gray-500 w-full mt-4' />}
                </React.Fragment>
    ))}
  </div>
  )
}

export default Pi
