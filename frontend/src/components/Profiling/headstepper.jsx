import React from 'react'

const headstepper = ({currentStep}) => {
    const steps = [
        {name: "Connaissance Client", shortName: "Profil", icon: <svg xmlns="http://www.w3.org/2000/svg" height="80px" viewBox="0 -960 960 960" width="80px" fill="#e3e3e3">
          <path d="M144-576v-85l155-155h85L144-576Zm0-190v-50h50l-50 50Zm480.32 89Q614-688 602.5-698T578-716l100-100h85L624.32-677ZM204-341l112-113q8 13 18 24t21 22l-21 21q-34 8-66.5 18.5T204-341Zm467-193q0-5 .5-9t.5-9q0-15.31-2.5-29.81-2.5-14.5-7.5-28.19l154-154v85L671-534ZM397-724l92-92h85l-74 74q-5.24-1-10-1.5t-10-.5q-22 0-42.5 5.5T397-724ZM144-386v-85l164-164q-6 16-12 32.67-6 16.66-6 33.33 0 9-1.5 18.5t.5 18.5L144-386Zm654 104q-7.72-12.71-17.86-24.35Q770-318 757-326l59-59v85l-18 18Zm-108-81q-7-2-13.5-6t-13.67-6q-9.21-3-17.91-6-8.71-3-17.92-5l189-189v85L690-363Zm-210-45q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42Zm.21-72Q510-480 531-501.21t21-51Q552-582 530.79-603t-51-21Q450-624 429-602.79t-21 51Q408-522 429.21-501t51 21ZM192-144v-68q0-25.5 12.5-47.25T239-294q55-32 116-49t125-17q64 0 125 17t116 49q22 13 34.5 34.75T768-212v68H192Zm73-72h430q0-5-2.5-9t-7.5-7q-47-29-99-42.5T480-288q-54 0-106 14t-99 42q-5 3-7.5 7t-2.5 9Zm215 0Zm0-336Z"/></svg>},
        {name: "Profil Épargnant", shortName: "Épargne", icon: ''},
        {name: "Profil Financier", shortName: "Finances", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
            <path fill="currentColor" d="M12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7zm10 28h-2v-5a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5H2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7zm0-26h10v2H22zm0 5h10v2H22zm0 5h7v2h-7z"/>
        </svg>},
        {name: "Profil Investisseur", shortName: "Investissement", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M16 6V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H2v13c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6h-6zm-6-2h4v2h-4V4zM9 18V9l7.5 4L9 18z"/>
        </svg>},
        {name: "Profil Sensibilités ESG", shortName: "ESG", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M14.572 7.714H6.429l.737-2.142h6.686q.012.006 0 0zm2.194-2.095l2.057 6.248a.04.04 0 0 1-.017.047l-1.8 1.299a.04.04 0 0 1-.042.006a.04.04 0 0 1-.027-.032l-2.481-7.543a.043.043 0 0 1 .043-.055h2.22q.015 0 .026.007a.04.04 0 0 1 .017.023zM8.64 8.409l-2.468 7.5a.04.04 0 0 1-.024.021l-.017.001l-.015-.005l-1.817-1.303a.034.034 0 0 1-.013-.039L6.33 8.383a.04.04 0 0 1 .039-.026h2.233a.04.04 0 0 1 .03.017a.03.03 0 0 1 .008.035m.6-.052h2.644a.04.04 0 0 1 .039.026l.686 2.07a.04.04 0 0 1-.005.034a.04.04 0 0 1-.03.017H8.55l-.017-.005a.04.04 0 0 1-.017-.046l.686-2.07a.04.04 0 0 1 .038-.026m5.554.03l.815 2.447a.04.04 0 0 1-.017.052l-1.796 1.294a.05.05 0 0 1-.043.004a.04.04 0 0 1-.019-.01a.04.04 0 0 1-.011-.02L12.48 8.417a.04.04 0 0 1 .001-.033a.04.04 0 0 1 .025-.022a.04.04 0 0 1 .021-.005h2.22a.04.04 0 0 1 .043.03zm-4.17 2.704l-1.238 3.772a.04.04 0 0 1-.026.026a.04.04 0 0 1-.038 0l-1.805-1.295a.04.04 0 0 1-.017-.047l.814-2.485a.04.04 0 0 1 .043-.026h2.225a.04.04 0 0 1 .042.034a.04.04 0 0 1 0 .021m5.863 2.495l-2.143 1.534a.04.04 0 0 1-.042 0l-1.809-1.294a.038.038 0 0 1 0-.06l3.257-2.349l.014-.007l.016-.001a.04.04 0 0 1 .026.025l.694 2.113a.04.04 0 0 1-.013.043zm3.21 1.028l-5.34 3.849a.04.04 0 0 1-.043 0l-1.817-1.299a.04.04 0 0 1 0-.064l6.467-4.65a.04.04 0 0 1 .05.002a.04.04 0 0 1 .01.015l.69 2.105a.04.04 0 0 1-.017.042m-9.12-1.517l3.257 2.336a.04.04 0 0 1 .013.03a.04.04 0 0 1-.017.034l-1.8 1.299a.04.04 0 0 1-.051 0L9.84 15.262a.04.04 0 0 1-.013-.043l.686-2.1a.043.043 0 0 1 .064-.022m-3.214 1.029l6.48 4.646l.01.012a.034.034 0 0 1-.01.043L12.03 20.13a.034.034 0 0 1-.043 0L6.63 16.29a.034.034 0 0 1-.013-.043l.69-2.104a.03.03 0 0 1 .026-.022a.04.04 0 0 1 .03 0z"/>
        </svg>}
    ];

  return (
    <div className="w-full px-4 py-6">
      {/* Progress bar */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 ">
          {/* Progress line */}
          <div 
            className="h-full bg-[#3CD4AB] transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
              <div key={index} className="flex flex-col items-center">
                {/* Step circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-semibold text-sm transition-all duration-300 relative z-10
                    ${isCompleted ? 'bg-[#3CD4AB] text-white' : ''}
                    ${isCurrent ? ' text-white shadow-lg scale-110' : ''}
                    ${isPending ? 'bg-white border-2 border-gray-300 text-gray-400' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>

                {/* Step label */}
                <div className="mt-2 text-center">
                  <p className={`
                    text-xs sm:text-sm font-medium transition-colors duration-300
                    ${isCurrent ? 'text-[#89559F]' : ''}
                    ${isCompleted ? 'text-[#3CD4AB]' : ''}
                    ${isPending ? 'text-gray-400' : ''}
                  `}>
                    <span className="hidden sm:inline">{step.name}</span>
                    <span className="sm:hidden">{step.shortName}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile current step indicator */}
      <div className="mt-6 sm:hidden">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {steps[currentStep]?.name}
            </span>
            <span className="text-xs text-gray-500">
              Étape {currentStep + 1}/{steps.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default headstepper
