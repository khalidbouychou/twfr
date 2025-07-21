import React from 'react'

const WhyTawfir = () => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center bg-white rounded-xl shadow-md p-8 gap-8 max-w-5xl mx-auto my-12">
      {/* Left: Image */}
      <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
        <img
          src="/public/whytawfir.jpg" // Replace with your preferred image path
          alt="Pourquoi choisir TawfirAi ?"
          className="rounded-lg object-cover w-200 h-200 shadow-lg"
        />
      </div>
      {/* Right: Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <h2 className="text-4xl font-extrabold mb-6 text-gray-900">Pourquoi choisir TawfirAi ?</h2>
        <div className="space-y-6">
          {/* Feature 1 */}
          <div className="flex items-start gap-4">
            <div className="bg-gray-900 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">01</div>
            <div>
              <h3 className="font-bold text-lg mb-1">Recommandations d'investissement personnalisées grâce à l'IA</h3>
              <p className="text-gray-700 text-base">
              TawfirAI utilise l'IA pour analyser votre profil financier et vos objectifs, et vous offre des recommandations d'investissement
              sur mesure, vous permettant de prendre des décisions éclairées sans conseiller financier.
              </p>
            </div>
          </div>
          {/* Feature 2 */}
          <div className="flex items-start gap-4">
            <div className="bg-gray-900 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">02</div>
            <div>
              <h3 className="font-bold text-lg mb-1">Facilité d'utilisation et accessibilité</h3>
              <p className="text-gray-700 text-base">
              Que vous soyez expert ou débutant, TawfirAI offre une plateforme intuitive, mobile-first.
              grâce à un parcours de simulation étape par étape et
              des recommandations simples, la gestion de vos finances et investissements devient facile et accessible à tous
              </p>
            </div>
          </div>
          {/* Feature 3 */}
          <div className="flex items-start gap-4">
            <div className="bg-gray-900 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">03</div>
            <div>
              <h3 className="font-bold text-lg mb-1">Sécurité optimale et tranquillité d'esprit</h3>
              <p className="text-gray-700 text-base">
              TawfirAI sécurise vos données et investissements avec l'authentification biométrique.
              </p>
            </div>
          </div>
        </div>
       <div className="flex flex-col items-center justify-center">
         <a
           href="#Signup"
           className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r bg-[#3CD4AB] text-white font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer"
         >
           CRÉER VOTRE COMPTE
         </a>
         <p className="mt-4 text-gray-500 text-sm text-center">
           Ces trois caractéristiques font de TawfirAI un partenaire fiable pour simplifier et sécuriser votre parcours financier
         </p>
       </div>
      </div>
    </div>
  )
}

export default WhyTawfir
