import React from 'react'

const headstepper = ({currentStep}) => {
    const steps = [
        {name: "Connaissance Client", icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 16 16">
            <path fill="currentColor" d="M13.5 0h-12C.675 0 0 .675 0 1.5v13c0 .825.675 1.5 1.5 1.5h12c.825 0 1.5-.675 1.5-1.5v-13c0-.825-.675-1.5-1.5-1.5zM13 14H2V2h11v12zM4 9h7v1H4zm0 2h7v1H4zm1-6.5a1.5 1.5 0 1 1 3.001.001A1.5 1.5 0 0 1 5 4.5zM7.5 6h-2C4.675 6 4 6.45 4 7v1h5V7c0-.55-.675-1-1.5-1z"/>
           </svg>}
        ,
        {name: "Profil Épargnant", icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
            <path fill="currentColor" d="M5 13.5H3a1 1 0 0 0-1 1V21a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.5a1 1 0 0 0-1-1m1 1h5.75a1.25 1.25 0 1 1 0 2.5H9.5"/><path fill="currentColor" d="M11 17h3.692a4 4 0 0 0 2.363-.773l2.629-1.925a1.44 1.44 0 0 1 1.896.117a1.43 1.43 0 0 1-.088 2.105l-4.397 3.578A4 4 0 0 1 14.57 21H6M19 7A5 5 0 1 1 9 7a5 5 0 0 1 10 0"/></svg>},
        {name: "Profil Financier", icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 32 32"><path fill="currentColor" d="M12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7zm10 28h-2v-5a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5H2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7zm0-26h10v2H22zm0 5h10v2H22zm0 5h7v2h-7z"/></svg>},
        {name: "Profil Investisseur", icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 2048 2048"><path fill="currentColor" d="M256 586v876l645 368q-11 32-18 64t-13 66l-742-424V512L1024 0l896 512v384q-28-28-60-50t-68-43V586l-768-439l-768 439zm768 147L768 879v290l225 129q2 42 10 83t23 81l-2 1l-384-220V805l384-220l325 186q-35 14-68 31t-65 40l-192-109zm739 856q65 33 118 81t90 108t57 128t20 142h-128q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149h-128q0-73 20-141t57-129t90-108t118-81q-74-54-115-135t-42-174q0-79 30-149t82-122t122-83t150-30q79 0 149 30t122 82t82 123t30 149q0 92-41 173t-115 136zm-483-309q0 53 20 99t55 82t81 55t100 20q53 0 99-20t82-55t55-81t20-100q0-53-20-99t-55-82t-81-55t-100-20q-53 0-99 20t-82 55t-55 81t-20 100z"/></svg>},
        {name: "Profil Sensibilités ESG", icon: <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M14.572 7.714H6.429l.737-2.142h6.686q.012.006 0 0zm2.194-2.095l2.057 6.248a.04.04 0 0 1-.017.047l-1.8 1.299a.04.04 0 0 1-.042.006a.04.04 0 0 1-.027-.032l-2.481-7.543a.043.043 0 0 1 .043-.055h2.22q.015 0 .026.007a.04.04 0 0 1 .017.023zM8.64 8.409l-2.468 7.5a.04.04 0 0 1-.024.021l-.017.001l-.015-.005l-1.817-1.303a.034.034 0 0 1-.013-.039L6.33 8.383a.04.04 0 0 1 .039-.026h2.233a.04.04 0 0 1 .03.017a.03.03 0 0 1 .008.035m.6-.052h2.644a.04.04 0 0 1 .039.026l.686 2.07a.04.04 0 0 1-.005.034a.04.04 0 0 1-.03.017H8.55l-.017-.005a.04.04 0 0 1-.017-.046l.686-2.07a.04.04 0 0 1 .038-.026m5.554.03l.815 2.447a.04.04 0 0 1-.017.052l-1.796 1.294a.05.05 0 0 1-.043.004a.04.04 0 0 1-.019-.01a.04.04 0 0 1-.011-.02L12.48 8.417a.04.04 0 0 1 .001-.033a.04.04 0 0 1 .025-.022a.04.04 0 0 1 .021-.005h2.22a.04.04 0 0 1 .043.03zm-4.17 2.704l-1.238 3.772a.04.04 0 0 1-.026.026a.04.04 0 0 1-.038 0l-1.805-1.295a.04.04 0 0 1-.017-.047l.814-2.485a.04.04 0 0 1 .043-.026h2.225a.04.04 0 0 1 .042.034a.04.04 0 0 1 0 .021m5.863 2.495l-2.143 1.534a.04.04 0 0 1-.042 0l-1.809-1.294a.038.038 0 0 1 0-.06l3.257-2.349l.014-.007l.016-.001a.04.04 0 0 1 .026.025l.694 2.113a.04.04 0 0 1-.013.043zm3.21 1.028l-5.34 3.849a.04.04 0 0 1-.043 0l-1.817-1.299a.04.04 0 0 1 0-.064l6.467-4.65a.04.04 0 0 1 .05.002a.04.04 0 0 1 .01.015l.69 2.105a.04.04 0 0 1-.017.042m-9.12-1.517l3.257 2.336a.04.04 0 0 1 .013.03a.04.04 0 0 1-.017.034l-1.8 1.299a.04.04 0 0 1-.051 0L9.84 15.262a.04.04 0 0 1-.013-.043l.686-2.1a.043.043 0 0 1 .064-.022m-3.214 1.029l6.48 4.646l.01.012a.034.034 0 0 1-.01.043L12.03 20.13a.034.034 0 0 1-.043 0L6.63 16.29a.034.034 0 0 1-.013-.043l.69-2.104a.03.03 0 0 1 .026-.022a.04.04 0 0 1 .03 0z"/></svg>}
    ];

    const getStepStyle = (stepIndex) => {
        if (stepIndex < currentStep) {
            return " bg-[#3CD4AB] border-none text-white";
        } else if (stepIndex === currentStep) {
            return "  border-none bg-white text-gray-800";
        } else {
            return "text-gray-600 border-none bg-gray-50";
        }
    };


  return (
    <>
    <div className="flex flex-col mx-80">
      <div>
        <ol className="grid grid-cols-1 divide-x  overflow-hidden rounded-2xl  text-sm  sm:grid-cols-5">

         {steps.map((step, index) => (
             <li key={index} className={`flex flex-col items-center justify-center gap-3 p-4 transition-all duration-500 ${getStepStyle(index)}`}>
                <div className="flex items-center justify-center">
                    {step.icon}
                </div>
                <p className="leading-tight text-center">
                    <strong className="block font-medium text-sm">{step.name}</strong>
                </p>
             
            </li>
         ))}
        </ol>
      </div>
    </div>
  </>
  )
}

export default headstepper
