import React, { useContext, useState } from 'react'
import { UserContext } from '../Context/UserContext.jsx'

const ConfirmationPopup = () => {
    const { 
        userAnswers, 
        showConfirmationPopup, 
        setShowConfirmationPopup, 
        modifyAnswer,
        currentEditingStep,
        setCurrentEditingStep,
        stepAnswers
    } = useContext(UserContext)
    
    const [editingAnswer, setEditingAnswer] = useState(null)
    const [tempAnswer, setTempAnswer] = useState('')

    if (!showConfirmationPopup) return null

    const handleModify = (answer, stepIndex, questionIndex) => {
        setEditingAnswer({ stepIndex, questionIndex, originalAnswer: answer })
        setTempAnswer(Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer)
        setCurrentEditingStep(stepIndex)
    }

    const handleSaveModification = () => {
        if (editingAnswer) {
            modifyAnswer(editingAnswer.stepIndex, editingAnswer.questionIndex, tempAnswer)
            setEditingAnswer(null)
            setTempAnswer('')
            setCurrentEditingStep(null)
        }
    }

    const handleCancelModification = () => {
        setEditingAnswer(null)
        setTempAnswer('')
        setCurrentEditingStep(null)
    }

    const getStepName = (stepIndex) => {
        const stepNames = {
            0: "Coordonnées et Caractéristiques",
            1: "Profil d'Épargne", 
            2: "Profil Financier",
            3: "Profil d'Investisseur",
            4: "ESG"
        }
        return stepNames[stepIndex] || `Étape ${stepIndex + 1}`
    }

    const getAnswersByStep = () => {
        const answersByStep = {}
        userAnswers.forEach((answer, index) => {
            // Find which step this answer belongs to
            let stepIndex = -1
            for (let i = 0; i < 5; i++) {
                if (stepAnswers[i] && stepAnswers[i].some(stepAnswer => 
                    stepAnswer.q === answer.q && stepAnswer.answer === answer.answer
                )) {
                    stepIndex = i
                    break
                }
            }
            
            if (stepIndex !== -1) {
                if (!answersByStep[stepIndex]) {
                    answersByStep[stepIndex] = []
                }
                answersByStep[stepIndex].push({ ...answer, originalIndex: index })
            }
        })
        return answersByStep
    }

    const answersByStep = getAnswersByStep()

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '90%',
                maxHeight: '90%',
                overflow: 'auto',
                width: '800px'
            }}>
                <h2>Récapitulatif de vos réponses</h2>
                
                {Object.entries(answersByStep).map(([stepIndex, answers]) => (
                    <div key={stepIndex} style={{ marginBottom: '20px' }}>
                        <h3 style={{ 
                            color: '#3CD4AB', 
                            borderBottom: '2px solid #3CD4AB',
                            paddingBottom: '5px',
                            marginBottom: '10px'
                        }}>
                            {getStepName(parseInt(stepIndex))}
                        </h3>
                        
                        {answers.map((answer, answerIndex) => (
                            <div key={answerIndex} style={{ 
                                marginBottom: '15px',
                                padding: '10px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '5px',
                                backgroundColor: editingAnswer?.stepIndex === parseInt(stepIndex) && 
                                               editingAnswer?.questionIndex === answerIndex ? '#f0f8ff' : 'white'
                            }}>
                                <strong>Question:</strong> {answer.q}<br/>
                                
                                {editingAnswer?.stepIndex === parseInt(stepIndex) && 
                                 editingAnswer?.questionIndex === answerIndex ? (
                                    <div style={{ marginTop: '10px' }}>
                                        <strong>Réponse:</strong>
                                        <input
                                            type="text"
                                            value={tempAnswer}
                                            onChange={(e) => setTempAnswer(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '5px',
                                                marginTop: '5px',
                                                border: '1px solid #ccc',
                                                borderRadius: '3px'
                                            }}
                                        />
                                        <div style={{ marginTop: '10px' }}>
                                            <button 
                                                onClick={handleSaveModification}
                                                style={{
                                                    padding: '5px 15px',
                                                    backgroundColor: '#3CD4AB',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer',
                                                    marginRight: '10px'
                                                }}
                                            >
                                                Sauvegarder
                                            </button>
                                            <button 
                                                onClick={handleCancelModification}
                                                style={{
                                                    padding: '5px 15px',
                                                    backgroundColor: '#ccc',
                                                    color: 'black',
                                                    border: 'none',
                                                    borderRadius: '3px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <strong>Réponse:</strong> {
                                            Array.isArray(answer.answer) 
                                                ? answer.answer.join(', ') 
                                                : answer.answer
                                        }
                                        {answer.category && <><br/><strong>Catégorie:</strong> {answer.category}</>}
                                        <button 
                                            onClick={() => handleModify(answer, parseInt(stepIndex), answerIndex)}
                                            style={{
                                                marginLeft: '10px',
                                                padding: '3px 8px',
                                                backgroundColor: '#89559F',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '3px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Modifier
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
                
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button 
                        onClick={() => setShowConfirmationPopup(false)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#3CD4AB',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        Valider les réponses
                    </button>
                    <button 
                        onClick={() => setShowConfirmationPopup(false)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#ccc',
                            color: 'black',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationPopup 