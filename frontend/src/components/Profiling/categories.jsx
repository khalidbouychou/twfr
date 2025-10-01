import React from 'react'
import Cc from './Cc'
import Pf from './Pf'
import Pi from './Pi'
import Esg from './Esg'
import Pe from './Pe'

const categories = ({currentStep}) => {
    return (
        <div className="w-full">
            {currentStep === 0 && (
                <Cc />
            )}
            {currentStep === 1 && (
                <Pe />
            )}
            {currentStep === 2 && (
                <Pf />
            )}
            {currentStep === 3 && (
                <Pi />
            )}
            {currentStep === 4 && (
                <Esg />
            )}
        </div>
    )
}

export default categories
