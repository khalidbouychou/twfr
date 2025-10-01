import React from 'react'
import Cc from './Cc'
import Pf from './Pf'
import Pi from './Pi'
import Esg from './Esg'
import Pe from './Pe'

const categories = ({currentStep, allAnswers}) => {
    return (
        <div className="w-full">
            {currentStep === 0 && (
                <Cc allAnswers={allAnswers} />
            )}
            {currentStep === 1 && (
                <Pe allAnswers={allAnswers} />
            )}
            {currentStep === 2 && (
                <Pf allAnswers={allAnswers} />
            )}
            {currentStep === 3 && (
                <Pi allAnswers={allAnswers} />
            )}
            {currentStep === 4 && (
                <Esg allAnswers={allAnswers} />
            )}
        </div>
    )
}

export default categories
