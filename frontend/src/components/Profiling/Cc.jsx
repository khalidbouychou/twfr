import React, { useContext, useEffect , useState } from 'react'
import { useLoading } from './LoadingContext'
import CcSkeleton from './CcSkeleton'
import { UserContext } from '../Context/UserContext.jsx'

const Cc = ({ allAnswers }) => {
    const { updateStepAnswers, stepAnswers } = useContext(UserContext)
    const [kycAnswers , setKycAnswers] = useState(() => {
        // Initialize from stepAnswers on mount
        return (stepAnswers && stepAnswers[0]) ? stepAnswers[0] : []
    })

    // Only initialize once when component mounts with saved data
    useEffect(() => {
        const savedAnswers = stepAnswers && stepAnswers[0] ? stepAnswers[0] : []
        if (savedAnswers.length > 0 && kycAnswers.length === 0) {
            setKycAnswers(savedAnswers)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleRadioChange = (questionIndex, value) => {
        setKycAnswers(prev => {
            const newAnswers = [...prev]
            newAnswers[questionIndex] = {
                q: lstquestion[questionIndex].question,
                answer: value
            }
            console.log("CC Radio Answer:", {
                question: lstquestion[questionIndex].question,
                answer: value,
                allAnswers: newAnswers
            })
            return newAnswers
        })
    }

    const handleSelectChange = (questionIndex, value) => {
        if (value === "") return // Don't log placeholder selection
        
        setKycAnswers(prev => {
            const newAnswers = [...prev]
            newAnswers[questionIndex] = {
                q: lstquestion[questionIndex].question,
                answer: value
            }
            console.log("CC Select Answer:", {
                question: lstquestion[questionIndex].question,
                answer: value,
                allAnswers: newAnswers
            })
            return newAnswers
        })
    }

    useEffect(() => {
        // Filter out empty answers and update step answers (guarded)
        const validAnswers = (kycAnswers || []).filter(a =>
            a && a.q && (Array.isArray(a.answer) ? a.answer.length > 0 : a.answer != null && a.answer !== '')
        );
        const prevForStep = stepAnswers && stepAnswers[0] ? stepAnswers[0] : []
        const isSame = JSON.stringify(prevForStep) === JSON.stringify(validAnswers)
        if (!isSame) {
            updateStepAnswers(0, validAnswers) // Step 0 for CC
        }
    }, [kycAnswers, stepAnswers, updateStepAnswers])
    
    const { isLoading } = useLoading()
    const lstquestion = [
        {
            question : "Quel est votre sexe ?",
            type : "radio",
            options : [
                {
                    label : "Homme",
                    value : "homme",
                    icon : <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 1024 1760"><path fill="white" d="M1024 672v416q0 40-28 68t-68 28t-68-28t-28-68V736h-64v912q0 46-33 79t-79 33t-79-33t-33-79v-464h-64v464q0 46-33 79t-79 33t-79-33t-33-79V736h-64v352q0 40-28 68t-68 28t-68-28t-28-68V672q0-80 56-136t136-56h640q80 0 136 56t56 136zM736 224q0 93-65.5 158.5T512 448t-158.5-65.5T288 224t65.5-158.5T512 0t158.5 65.5T736 224z"/></svg>
                },
                {
                    label : "Femme",
                    value : "femme",
                    icon : <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 14 14"><path fill="white" fillRule="evenodd" d="M9.066 2.066a2.066 2.066 0 1 1-4.132 0a2.066 2.066 0 0 1 4.132 0M8.498 13.6l.39-1.944h1.522c.246 0 .448-.2.47-.456a.307.307 0 0 0-.007-.09a35.88 35.88 0 0 1-.206-1.076C10.242 7.686 9.75 4.975 7 4.975s-3.242 2.711-3.667 5.058c-.067.372-.133.735-.206 1.076a.306.306 0 0 0-.007.09a.484.484 0 0 0 .47.456h1.521l.391 1.944a.5.5 0 0 0 .49.401h2.016a.5.5 0 0 0 .49-.401Z" clipRule="evenodd"/></svg>
                }
            ]
        },
        {
            question : "Quel est votre âge ?",
            options : [
                {
                    label : "Moins de 25 ans",
                    value : "less_than_25"
                },
                {
                    label : "26 à 40 ans",
                    value : "between_25_and_34"
                },
                {
                    label : "plus de 40 ans",
                    value : "between_35_and_44"
                }
            ]
        },
        
        {
            question : "Quelle est votre situation familiale ?",
            options : [
                {
                    label : "Célibataire",
                    value : "celibataire"
                },
                {
                    label : "En couple",
                    value : "couple"
                },
                {
                    label : "Avec enfant(s)",
                    value : "enfant"
                }
            ]
        },
        {
            question : "Dans quelle zone habitez-vous ?",
            options : [
                {
                    label : "Urbaine",
                    value : "urbaine"
                },
                {
                    label : "Périurbaine",
                    value : "periurbaine"
                },
                {
                    label : "Rurale",
                    value : "rurale"
                }
            ]
        },
        {
            question : "Quel est votre niveau d'étude ?",
            options : [
                {
                    label : "Primaire",
                    value : "primaire"
                },
                {
                    label : "Secondaire",
                    value : "secondaire"
                },
                {
                    label : "Supérieur",
                    value : "superieur"
                },
                {
                    label : "Formation professionnelle",
                    value : "formation_professionnelle"
                }
            ]
        },
    ]
    if (isLoading) {
      return <CcSkeleton />
    }

  return (
      <div className="w-full">
        {/* Info banner */}
        <div className="mb-4 flex items-start gap-3 rounded-xl bg-blue-500/10 border border-blue-500/20 px-4 py-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div className="text-sm text-blue-200 font-light">
            <span className="font-medium text-blue-100">Information importante :</span> Toutes les questions sont obligatoires pour passer à l'étape suivante.
          </div>
        </div>
        
        <div className="space-y-4">
        {lstquestion.map((question, index) => (
          <div key={`question-${index}`} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
            <label className="flex items-start gap-2 text-white font-light text-sm mb-3">
              <span className="text-red-400 text-lg leading-none">*</span>
              <span className="flex-1">{question.question}</span>
            </label>

            {question.type === "radio" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {question.options.map((option, optionIndex) => (
                  <label 
                    key={`radio-${index}-${optionIndex}`} 
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#3CD4AB] hover:bg-white/10 cursor-pointer transition-all duration-200 group"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option.label}
                      className="w-4 h-4 text-[#3CD4AB] bg-gray-700 border-gray-600 focus:ring-[#3CD4AB] focus:ring-2"
                      onChange={() => handleRadioChange(index, option.label)}
                      checked={kycAnswers[index]?.answer === option.label}
                      required
                    />
                    {option.icon && (
                      <div className="w-5 h-5 flex-shrink-0 text-white/80 group-hover:text-[#3CD4AB] transition-colors">
                        {option.icon}
                      </div>
                    )}
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
                value={kycAnswers[index]?.answer || ""}
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

export default Cc
