import React, { useState } from 'react';
import { InvestmentResults } from '../Resultat';
import { useUserContext } from '../Context/UserContext';

const FinancialProfilingStepper = () => {
  const { updateUserProfile, updateUserResults } = useUserContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Sociodemographic Profile
    gender: '',
    age: '',
    familyStatus: '',
    residence: '',
    educationLevel: '',
    
    // Step 2: Financial Behavior & Goals
    savingsGoals: [],
    savingsDuration: '',
    savingsFrequency: '',
    
    // Step 3: Financial Profile
    incomeRange: '',
    recurringExpenses: '',
    expensesPercentage: '',
    
    // Step 4: Investment Experience & Risk Tolerance
    investmentExperience: [],
    lossReaction: '',
    marketCrashReaction: '',
    investmentBasis: '',
    
    // Step 5: ESG Preferences
    environmentalImpact: '',
    inclusionPolicies: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultipleChoice = (field, value, isChecked) => {
    setFormData(prev => ({
      ...prev,
      [field]: isChecked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowConfirmation(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goBackToEdit = () => {
    setShowConfirmation(false);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.gender && formData.age && formData.familyStatus && 
               formData.residence && formData.educationLevel;
      case 2:
        return formData.savingsGoals.length > 0 && formData.savingsDuration && 
               formData.savingsFrequency;
      case 3:
        return formData.incomeRange && formData.recurringExpenses && 
               formData.expensesPercentage;
      case 4:
        return formData.investmentExperience.length >= 0 && formData.lossReaction && 
               formData.marketCrashReaction && formData.investmentBasis;
      case 5:
        return formData.environmentalImpact && formData.inclusionPolicies;
      default:
        return false;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-6">Profil Sociodémographique</h2>
      
      {/* Gender */}
      <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Mr / Mme ?
        </label>
        <div className="space-y-2">
          {['Mme', 'Mr'].map((option) => (
            <label key={option} className="flex items-center cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
              <input
                type="radio"
                name="gender"
                value={option}
                checked={formData.gender === option}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="mr-2 accent-[#3CD4AB]"
              />
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Age */}
      <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Quel âge avez-vous ?
        </label>
        <select
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          className="w-full p-3 border border-[#89559F] rounded-lg focus:ring-2 focus:ring-[#3CD4AB] focus:border-transparent bg-[#0F0F19] text-white"
        >
          <option value="">Sélectionnez votre âge</option>
          <option value="0-18">0 - 18 ans</option>
          <option value="19-59">19 - 59 ans</option>
          <option value="60+">Plus de 60 ans</option>
        </select>
      </div>

      {/* Family Status */}
      <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Quelle est votre situation familiale ?
        </label>
        <div className="space-y-2">
          {['Célibataire', 'En couple', 'Avec enfant(s)'].map((option) => (
            <label key={option} className="flex items-center cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
              <input
                type="radio"
                name="familyStatus"
                value={option}
                checked={formData.familyStatus === option}
                onChange={(e) => handleInputChange('familyStatus', e.target.value)}
                className="mr-2 accent-[#3CD4AB]"
              />
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Residence */}
      <div className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Où résidez-vous ?
        </label>
        <div className="space-y-2">
          {['Urbaine', 'Périurbaine', 'Rurale'].map((option) => (
            <label key={option} className="flex items-center cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
              <input
                type="radio"
                name="residence"
                value={option}
                checked={formData.residence === option}
                onChange={(e) => handleInputChange('residence', e.target.value)}
                className="mr-2 accent-[#3CD4AB]"
              />
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Education Level */}
      <div className="animate-slideUp" style={{ animationDelay: '0.5s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Quel est votre niveau d'études ?
        </label>
        <div className="space-y-2">
          {['Primaire', 'Secondaire', 'Supérieur', 'Formation Pro'].map((option) => (
            <label key={option} className="flex items-center cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
              <input
                type="radio"
                name="educationLevel"
                value={option}
                checked={formData.educationLevel === option}
                onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                className="mr-2 accent-[#3CD4AB]"
              />
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-6">Comportement Financier & Objectifs</h2>
      
      {/* Savings Goals */}
      <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Quels sont vos principaux objectifs d'épargne ? (Sélection multiple)
        </label>
        <div className="space-y-2">
          {['Voyage', 'Retraite', 'Acquisition', 'Projets individuels', 'Fonds de sécurité', 'Immobilier'].map((goal) => (
            <label key={goal} className="flex items-center cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
              <input
                type="checkbox"
                value={goal}
                checked={formData.savingsGoals.includes(goal)}
                onChange={(e) => handleMultipleChoice('savingsGoals', goal, e.target.checked)}
                className="mr-2 accent-[#3CD4AB]"
              />
              <span className="text-white">{goal}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Savings Duration */}
      <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Quelle est la durée de vos objectifs d'épargne ?
        </label>
        <div className="space-y-2">
          {[
            'Court terme (0 à 3 ans): Voyage, Urgences, etc.',
            'Moyen terme (3 à 10 ans): Projets personnels, Achats, etc.',
            'Long terme (10+ ans): Retraite, Patrimoine, etc.'
          ].map((option) => (
            <label key={option} className="flex items-center cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
              <input
                type="radio"
                name="savingsDuration"
                value={option}
                checked={formData.savingsDuration === option}
                onChange={(e) => handleInputChange('savingsDuration', e.target.value)}
                className="mr-2 accent-[#3CD4AB]"
              />
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Savings Frequency */}
      <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          À quelle fréquence épargnez-vous ?
        </label>
        <select
          value={formData.savingsFrequency}
          onChange={(e) => handleInputChange('savingsFrequency', e.target.value)}
          className="w-full p-3 border border-[#89559F] rounded-lg focus:ring-2 focus:ring-[#3CD4AB] focus:border-transparent bg-[#0F0F19] text-white"
        >
          <option value="">Sélectionnez la fréquence</option>
          <option value="Jamais">Jamais</option>
          <option value="Occasionnelle">Occasionnelle</option>
          <option value="Mensuelle">Mensuelle</option>
          <option value="Automatique">Automatique</option>
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-6">Profil Financier</h2>
      
      {/* Income Range */}
      <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Sélectionnez votre tranche de revenus
        </label>
        <select
          value={formData.incomeRange}
          onChange={(e) => handleInputChange('incomeRange', e.target.value)}
          className="w-full p-3 border border-[#89559F] rounded-lg focus:ring-2 focus:ring-[#3CD4AB] focus:border-transparent bg-[#0F0F19] text-white"
        >
          <option value="">Sélectionnez votre revenu</option>
          <option value="Moins de 3000 Dhs">Moins de 3000 Dhs</option>
          <option value="3000 - 6000 Dhs">3000 - 6000 Dhs</option>
          <option value="Plus de 6000 Dhs">Plus de 6000 Dhs</option>
        </select>
      </div>

      {/* Recurring Expenses */}
      <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Dépenses récurrentes (loyer, scolarité, remboursements de crédits)
        </label>
        <input
          type="number"
          placeholder="Montant en MAD"
          value={formData.recurringExpenses}
          onChange={(e) => handleInputChange('recurringExpenses', e.target.value)}
          className="w-full p-3 border border-[#89559F] rounded-lg focus:ring-2 focus:ring-[#3CD4AB] focus:border-transparent bg-[#0F0F19] text-white placeholder-gray-400"
        />
      </div>

      {/* Expenses Percentage */}
      <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Quel pourcentage de votre revenu est consacré aux dépenses récurrentes ?
        </label>
        <div className="space-y-2">
          {['Faible (moins de 30%)', 'Modéré (30-45%)', 'Élevé (plus de 45%)'].map((option) => (
            <label key={option} className="flex items-center cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
              <input
                type="radio"
                name="expensesPercentage"
                value={option}
                checked={formData.expensesPercentage === option}
                onChange={(e) => handleInputChange('expensesPercentage', e.target.value)}
                className="mr-2 accent-[#3CD4AB]"
              />
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-6">Expérience d'Investissement & Tolérance au Risque</h2>
      
      {/* Investment Experience */}
      <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Quelle est votre expérience d'investissement ?
        </label>
        <div className="space-y-2">
          {['Cryptomonnaies', 'Actions', 'Obligations', 'Immobilier', 'Aucun'].map((experience) => (
            <label key={experience} className="flex items-center cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
              <input
                type="checkbox"
                value={experience}
                checked={formData.investmentExperience.includes(experience)}
                onChange={(e) => handleMultipleChoice('investmentExperience', experience, e.target.checked)}
                className="mr-2 accent-[#3CD4AB]"
              />
              <span className="text-white">{experience}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Loss Reaction */}
      <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Si votre investissement perd 10% de sa valeur, quelle serait votre réaction ?
        </label>
        <div className="space-y-2">
          {['Vendre tout', 'Attendre', 'Investir davantage'].map((option) => (
            <label key={option} className="flex items-center cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
              <input
                type="radio"
                name="lossReaction"
                value={option}
                checked={formData.lossReaction === option}
                onChange={(e) => handleInputChange('lossReaction', e.target.value)}
                className="mr-2 accent-[#3CD4AB]"
              />
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Market Crash Reaction */}
      <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Le marché chute de 10% en une semaine. Que faites-vous ?
        </label>
        <div className="space-y-2">
          {['Je vends tout', 'J\'attends de voir', 'J\'investis davantage'].map((option) => (
            <label key={option} className="flex items-center cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
              <input
                type="radio"
                name="marketCrashReaction"
                value={option}
                checked={formData.marketCrashReaction === option}
                onChange={(e) => handleInputChange('marketCrashReaction', e.target.value)}
                className="mr-2 accent-[#3CD4AB]"
              />
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Investment Basis */}
      <div className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Sur quoi basez-vous vos décisions d'investissement ?
        </label>
        <div className="space-y-2">
          {['Mon intuition', 'L\'avis d\'un proche ou expert', 'Des analyses fiables'].map((option) => (
            <label key={option} className="flex items-center cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
              <input
                type="radio"
                name="investmentBasis"
                value={option}
                checked={formData.investmentBasis === option}
                onChange={(e) => handleInputChange('investmentBasis', e.target.value)}
                className="mr-2 accent-[#3CD4AB]"
              />
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-6">Préférences ESG (Environnement, Social et Gouvernance)</h2>
      
      {/* Environmental Impact */}
      <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Dans quelle mesure souhaitez-vous exclure les entreprises à fort impact environnemental de votre portefeuille ?
        </label>
        <div className="space-y-2">
          {['Pas du tout important', 'Assez important', 'Très important'].map((option) => (
            <label key={option} className="flex items-center cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
              <input
                type="radio"
                name="environmentalImpact"
                value={option}
                checked={formData.environmentalImpact === option}
                onChange={(e) => handleInputChange('environmentalImpact', e.target.value)}
                className="mr-2 accent-[#3CD4AB]"
              />
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Inclusion Policies */}
      <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <label className="block text-sm font-medium text-white mb-3">
          Quelle importance accordez-vous aux politiques d'inclusion et d'équité dans vos choix d'investissement ?
        </label>
        <div className="space-y-2">
          {['Pas du tout important', 'Assez important', 'Très important'].map((option) => (
            <label key={option} className="flex items-center cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
              <input
                type="radio"
                name="inclusionPolicies"
                value={option}
                checked={formData.inclusionPolicies === option}
                onChange={(e) => handleInputChange('inclusionPolicies', e.target.value)}
                className="mr-2 accent-[#3CD4AB]"
              />
              <span className="text-white">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-white mb-6">Confirmation de vos réponses</h2>
      <div className="space-y-6">
        {/* Step 1 Summary */}
        <div className="bg-white/10 rounded-lg p-4 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-lg font-semibold text-[#3CD4AB] mb-3">Profil Sociodémographique</h3>
          <div className="grid md:grid-cols-2 gap-4 text-white">
            <div><strong>Genre:</strong> {formData.gender}</div>
            <div><strong>Âge:</strong> {formData.age}</div>
            <div><strong>Situation familiale:</strong> {formData.familyStatus}</div>
            <div><strong>Résidence:</strong> {formData.residence}</div>
            <div><strong>Niveau d'études:</strong> {formData.educationLevel}</div>
          </div>
        </div>

        {/* Step 2 Summary */}
        <div className="bg-white/10 rounded-lg p-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold text-[#3CD4AB] mb-3">Comportement Financier & Objectifs</h3>
          <div className="space-y-2 text-white">
            <div><strong>Objectifs d'épargne:</strong> {formData.savingsGoals.join(', ')}</div>
            <div><strong>Durée des objectifs:</strong> {formData.savingsDuration}</div>
            <div><strong>Fréquence d'épargne:</strong> {formData.savingsFrequency}</div>
          </div>
        </div>

        {/* Step 3 Summary */}
        <div className="bg-white/10 rounded-lg p-4 animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-semibold text-[#3CD4AB] mb-3">Profil Financier</h3>
          <div className="space-y-2 text-white">
            <div><strong>Tranche de revenus:</strong> {formData.incomeRange}</div>
            <div><strong>Dépenses récurrentes:</strong> {formData.recurringExpenses} MAD</div>
            <div><strong>Pourcentage des dépenses:</strong> {formData.expensesPercentage}</div>
          </div>
        </div>

        {/* Step 4 Summary */}
        <div className="bg-white/10 rounded-lg p-4 animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-semibold text-[#3CD4AB] mb-3">Expérience d'Investissement & Tolérance au Risque</h3>
          <div className="space-y-2 text-white">
            <div><strong>Expérience d'investissement:</strong> {formData.investmentExperience.join(', ') || 'Aucune'}</div>
            <div><strong>Réaction à une perte:</strong> {formData.lossReaction}</div>
            <div><strong>Réaction à un crash:</strong> {formData.marketCrashReaction}</div>
            <div><strong>Base des décisions:</strong> {formData.investmentBasis}</div>
          </div>
        </div>

        {/* Step 5 Summary */}
        <div className="bg-white/10 rounded-lg p-4 animate-slideUp" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-lg font-semibold text-[#3CD4AB] mb-3">Préférences ESG</h3>
          <div className="space-y-2 text-white">
            <div><strong>Impact environnemental:</strong> {formData.environmentalImpact}</div>
            <div><strong>Politiques d'inclusion:</strong> {formData.inclusionPolicies}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (showConfirmation) {
      return renderConfirmation();
    }
    
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    // Update user profile in context
    updateUserProfile(formData);
    setShowResults(true);
  };

  // Show results if user has submitted
  if (showResults) {
    return <InvestmentResults formData={formData} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#0F0F19] rounded-lg shadow-lg">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                step <= currentStep 
                  ? 'bg-[#3CD4AB] text-[#0F0F19]' 
                  : 'bg-[#89559F] text-white'
              }`}>
                {step}
              </div>
              {step < 5 && (
                <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                  step < currentStep ? 'bg-[#3CD4AB]' : 'bg-[#89559F]'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm text-white">
          {showConfirmation ? 'Confirmation' : `Étape ${currentStep} sur 5`}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        {showConfirmation ? (
          <>
            <button
              onClick={goBackToEdit}
              className="px-6 py-2 rounded-lg bg-[#89559F] text-white hover:bg-[#7a4a8a] transition-all duration-200"
            >
              Modifier
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg bg-[#3CD4AB] text-[#0F0F19] hover:bg-[#2bb894] transition-all duration-200 font-semibold"
            >
              Confirmer et Soumettre
            </button>
          </>
        ) : (
          <>
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                currentStep === 1
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-[#89559F] text-white hover:bg-[#7a4a8a]'
              }`}
            >
              Précédent
            </button>
            
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                isStepValid()
                  ? 'bg-[#3CD4AB] text-[#0F0F19] hover:bg-[#2bb894] font-semibold'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === 5 ? 'Confirmer' : 'Suivant'}
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FinancialProfilingStepper; 