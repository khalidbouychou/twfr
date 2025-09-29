import React from "react";
import { CloudinaryVideo } from "../lib/cloudinary-components";

const Hero = () => {
  return (
    <section className="w-full py-8 sm:py-10 lg:py-15 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center px-2 sm:px-6 lg:px-8 gap-6 lg:gap-8" data-aos="fade-up">
        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4 lg:mb-6">
            Investissez intelligemment <br className="hidden lg:block" /> pour
            votre avenir financier
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#d4d4d7] mb-6 lg:mb-8 max-w-xl mx-auto lg:mx-0 px-4 lg:px-0">
          Obtenez des recommandations d'investissement personnalisées basées sur vos objectifs financiers et votre profil de risque
          </p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mt-6 lg:mt-8 items-center justify-center lg:justify-start">
            <a
              href="/simulation"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-[#3CD4AB] text-white font-semibold rounded-full text-base lg:text-lg shadow-2xl hover:bg-[#89559F] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3CD4AB] flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              Démarrer la simulation
            </a>
            <a
              href="#contact"
              className="px-6 sm:px-8 py-3 sm:py-4 text-white font-semibold rounded-full text-base lg:text-lg shadow-2xl border border-white bg-[#0F0F19] hover:bg-[#f0f0f0] hover:text-[#89559f] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#3CD4AB] flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                />
              </svg>
              Devenir partenaire
            </a>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="flex-1 flex justify-center mt-6 lg:mt-0">
          <CloudinaryVideo
            src="public/assets/00.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] rounded-2xl shadow-lg"
            options={{
              quality: "auto",
              format: "auto",
              width: 500
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
