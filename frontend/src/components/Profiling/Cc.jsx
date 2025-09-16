import React, { useContext, useEffect , useState } from 'react'
import { useLoading } from './LoadingContext'
import CcSkeleton from './CcSkeleton'
import { UserContext } from '../Context/UserContext.jsx'

const Cc = ({ allAnswers }) => {
    const { updateStepAnswers, stepAnswers } = useContext(UserContext)
    const [kycAnswers , setKycAnswers] = useState([])

    // Initialize answers from previous steps or existing answers (guarded)
    useEffect(() => {
        const incoming = allAnswers && allAnswers[0] ? allAnswers[0] : []
        // Only set if local is empty OR content differs
        const incomingStr = JSON.stringify(incoming)
        const localStr = JSON.stringify(kycAnswers)
        if ((kycAnswers.length === 0 && incoming.length > 0) || incomingStr !== localStr) {
            setKycAnswers(incoming)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allAnswers])

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
    <div className="p-2 mt-4  rounded-lg shadow-md">
      {lstquestion.map((question, index) => (
         <React.Fragment key={`question-${index}`}>
            <div className=" flex flex-row items-start justify-between w-full gap-2 mt-6">
           <label className="text-gray-50 w-1/2">{question.question}</label>
           {question.type === "radio" ? (
             <div className="flex gap-30 w-1/2 justify-start">
               {question.options.map((option, optionIndex) => (
                 <label key={`radio-${index}-${optionIndex}`} className="flex items-center gap-2 cursor-pointer">
                   <input
                     type="radio"
                     name={`question-${index}`}
                     value={option.label}
                     className="w-4 h-4 text-green-50 accent-emerald-400 rounded-full"
                     onChange={() => handleRadioChange(index, option.label)}
                     checked={kycAnswers[index]?.answer === option.label}
                     required
                   />
                   {option.icon}
                   <span className="text-gray-50">{option.label}</span>
                 </label>
               ))}
             </div>
           ) : (
             <form className="w-1/2">
               <select 
                 className="w-full font-light rounded-lg border-none bg-gray-200 p-2"
                 onChange={(e) => handleSelectChange(index, e.target.value)}
                 value={kycAnswers[index]?.answer || ""}
                 required
               >
                 <option className='text-gray-500' value="">Sélectionnez une option</option>

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

export default Cc
