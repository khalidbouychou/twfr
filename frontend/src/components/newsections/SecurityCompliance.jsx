import React from 'react';
import { FaLock, FaFingerprint, FaShieldAlt, FaFileContract } from 'react-icons/fa';

const securityFeatures = [
  {
    title: 'Chiffrement de Bout en Bout',
    description: 'Chiffrement complet utilisant les normes AES-256 et TLS 1.3.',
    icon: <FaLock className="w-8 h-8" />,
  },
  {
    title: 'Authentification Multi-Facteurs',
    description: 'OTP obligatoire et connexion biométrique pour une sécurité renforcée du compte.',
    icon: <FaFingerprint className="w-8 h-8" />,
  },
  {
    title: 'Conformité Réglementaire',
    description: 'Respect de l\'AMMC, Bank Al-Maghrib, RGPD et de la loi marocaine 09-08.',
    icon: <FaShieldAlt className="w-8 h-8" />,
  },
  {
    title: 'Intégration KYC/AML',
    description: 'Processus intégrés pour la Connaissance du Client et la Lutte contre le Blanchiment d\'Argent.',
    icon: <FaFileContract className="w-8 h-8" />,
  },
];

const SecurityCompliance = () => {
  return (
    <section className="w-full py-20 bg-[#0b0b17]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
          Sécurité, Conformité et Confiance
        </h2>
        <p className="text-lg text-gray-300 text-center mb-16 max-w-3xl mx-auto">
          Nous assurons une protection maximale et le respect des réglementations financières internationales et locales.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Security Images */}
          <div className="grid grid-cols-2 gap-4" data-aos="fade-right">
            {/* Encryption Visual */}
            <div className="bg-[#89559F] rounded-2xl p-6 aspect-square flex items-center justify-center">
              <FaLock className="w-32 h-32 text-white" />
            </div>

            {/* Compliance Document */}
            <div className="bg-[#1a1a2e] rounded-2xl p-6 aspect-square flex items-center justify-center border border-[#3CD4AB]">
              <FaFileContract className="w-32 h-32 text-[#3CD4AB]" />
            </div>

            {/* Biometric */}
            <div className="bg-[#1a1a2e] rounded-2xl p-6 aspect-square flex items-center justify-center border border-[#3CD4AB] col-span-2">
              <FaFingerprint className="w-40 h-40 text-[#89559F]" />
            </div>
          </div>

          {/* Right: Features List */}
          <div className="space-y-6" data-aos="fade-left">
            {securityFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 bg-[#1a1a2e] p-6 rounded-xl hover:bg-[#252538] transition-all duration-300 border border-[#89559F]"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-[#89559F] rounded-lg flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Statement */}
        <div className="text-center" data-aos="fade-up">
          <div className="inline-block bg-[#1a1a2e] px-8 py-6 rounded-2xl border-2 border-[#3CD4AB]">
            <p className="text-xl text-white font-semibold">
              🔒 Vos données et investissements sont protégés par un chiffrement de niveau militaire et la conformité aux normes internationales
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityCompliance;
