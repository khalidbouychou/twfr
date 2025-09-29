import React from 'react'
import Cc from './Cc'
import Pf from './Pf'
import Pi from './Pi'
import Esg from './Esg'
import Pe from './Pe'

const categories = ({currentStep, allAnswers}) => {
    return (
        <div className="flex-1 mt-3 sm:mt-4 lg:mt-6 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
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
        </div>
    )
}

export default categories
