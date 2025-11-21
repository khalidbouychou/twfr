import React from 'react'

const headstepper = ({currentStep}) => {
    const steps = [
        {name: "Connaissance Client", shortName: "Profil", icon: <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="#e3e3e3">
          <path d="M144-576v-85l155-155h85L144-576Zm0-190v-50h50l-50 50Zm480.32 89Q614-688 602.5-698T578-716l100-100h85L624.32-677ZM204-341l112-113q8 13 18 24t21 22l-21 21q-34 8-66.5 18.5T204-341Zm467-193q0-5 .5-9t.5-9q0-15.31-2.5-29.81-2.5-14.5-7.5-28.19l154-154v85L671-534ZM397-724l92-92h85l-74 74q-5.24-1-10-1.5t-10-.5q-22 0-42.5 5.5T397-724ZM144-386v-85l164-164q-6 16-12 32.67-6 16.66-6 33.33 0 9-1.5 18.5t.5 18.5L144-386Zm654 104q-7.72-12.71-17.86-24.35Q770-318 757-326l59-59v85l-18 18Zm-108-81q-7-2-13.5-6t-13.67-6q-9.21-3-17.91-6-8.71-3-17.92-5l189-189v85L690-363Zm-210-45q-60 0-102-42t-42-102q0-60 42-102t102-42q60 0 102 42t42 102q0 60-42 102t-102 42Zm.21-72Q510-480 531-501.21t21-51Q552-582 530.79-603t-51-21Q450-624 429-602.79t-21 51Q408-522 429.21-501t51 21ZM192-144v-68q0-25.5 12.5-47.25T239-294q55-32 116-49t125-17q64 0 125 17t116 49q22 13 34.5 34.75T768-212v68H192Zm73-72h430q0-5-2.5-9t-7.5-7q-47-29-99-42.5T480-288q-54 0-106 14t-99 42q-5 3-7.5 7t-2.5 9Zm215 0Zm0-336Z"/></svg>},
        {name: "Profil Épargnant", shortName: "Épargne", icon: <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="#e3e3e3"><path d="M640-520q17 0 28.5-11.5T680-560q0-17-11.5-28.5T640-600q-17 0-28.5 11.5T600-560q0 17 11.5 28.5T640-520Zm-320-80h200v-80H320v80ZM180-120q-34-114-67-227.5T80-580q0-92 64-156t156-64h200q29-38 70.5-59t89.5-21q25 0 42.5 17.5T720-820q0 6-1.5 12t-3.5 11q-4 11-7.5 22.5T702-751l91 91h87v279l-113 37-67 224H480v-80h-80v80H180Zm60-80h80v-80h240v80h80l62-206 98-33v-141h-40L620-720q0-20 2.5-38.5T630-796q-29 8-51 27.5T547-720H300q-58 0-99 41t-41 99q0 98 27 191.5T240-200Zm240-298Z"/></svg>},
        {name: "Profil Financier", shortName: "Finances", icon: <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="#e3e3e3"><path d="M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-470h480q29 0 54.5 9t45.5 26v-45q0-42-29-71t-71-29H240q-42 0-71 29t-29 71v45q20-17 45.5-26t54.5-9Zm-97 136 477 115q7 2 14.5.5T647-385l160-134q-13-23-36-37t-51-14H240q-35 0-62 21.5T143-494Z"/></svg>},
        {name: "Profil Investisseur", shortName: "Investissement", icon: <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="#e3e3e3"><path d="m140-85-46-46 300-300 160 161 298-335 42 41-340 384-160-159L140-85Zm0-269-46-46 300-300 160 161 298-335 42 41-340 384-160-159-254 254Z"/></svg>},
        {name: "Profil Sensibilités ESG", shortName: "ESG", icon: <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="#e3e3e3"><path d="M40-160v-160q0-29 20.5-49.5T110-390h141q17 0 32.5 8.5T310-358q29 42 74 65t96 23q51 0 96-23t75-65q11-15 26-23.5t32-8.5h141q29 0 49.5 20.5T920-320v160H660v-119q-36 33-82.5 51T480-210q-51 0-97-18t-83-51v119H40Zm440-170q-35 0-67.5-16.5T360-392q-16-23-38.5-37T273-448q29-30 91-46t116-16q54 0 116.5 16t91.5 46q-26 5-48.5 19T601-392q-20 29-52.5 45.5T480-330ZM160-460q-45 0-77.5-32.5T50-570q0-46 32.5-78t77.5-32q46 0 78 32t32 78q0 45-32 77.5T160-460Zm640 0q-45 0-77.5-32.5T690-570q0-46 32.5-78t77.5-32q46 0 78 32t32 78q0 45-32 77.5T800-460ZM480-580q-45 0-77.5-32.5T370-690q0-46 32.5-78t77.5-32q46 0 78 32t32 78q0 45-32 77.5T480-580Z"/></svg>}
    ];

  return (
    <div className="w-full ">
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
                    ${isCurrent ? ' text-white shadow-lg scale-110 bg-[#0F0F19]' : ''}
                    ${isPending ? '   text-gray-400' : ''}
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
