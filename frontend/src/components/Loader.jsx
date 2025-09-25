import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0F0F19] z-50">
      <div className="loader">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .loader {
            --dim: 3rem;
            width: var(--dim);
            height: var(--dim);
            position: relative;
            animation: spin988 2s linear infinite;
          }

          .circle {
            --color: #3CD4AB;
            --dim: 1.2rem;
            width: var(--dim);
            height: var(--dim);
            background-color: var(--color);
            border-radius: 50%;
            position: absolute;
          }

          .circle-1 {
            top: 0;
            left: 0;
          }

          .circle-2 {
            top: 0;
            right: 0;
          }

          .circle-3 {
            bottom: 0;
            left: 0;
          }

          .circle-4 {
            bottom: 0;
            right: 0;
          }

          @keyframes spin988 {
            0% {
              transform: scale(1) rotate(0);
            }

            20%, 25% {
              transform: scale(1.3) rotate(90deg);
            }

            45%, 50% {
              transform: scale(1) rotate(180deg);
            }

            70%, 75% {
              transform: scale(1.3) rotate(270deg);
            }

            95%, 100% {
              transform: scale(1) rotate(360deg);
            }
          }
        `
      }} />
    </div>
  );
};

export default Loader;
