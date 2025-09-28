import React, { useState } from 'react';
import { useSharedData } from '../../Context/useSharedData.js';


const riskProfiles = [
  { value: 'conservateur', label: 'Conservateur (4% annuel)', rate: 0.04 },
  { value: 'modere', label: 'Modéré (7% annuel)', rate: 0.07 },
  { value: 'dynamique', label: 'Dynamique (10% annuel)', rate: 0.10 },
  { value: 'agressif', label: 'Agressif (15% annuel)', rate: 0.15 },
];

const productRecommendations = {
  conservateur: ['Compte sur Carnet', 'OPCVM Monétaires', 'Dépôt à Terme'],
  modere: ['OPCVM Monétaires', 'Gestion sous Mandat', 'OPCVM Actions'],
  dynamique: ['OPCVM Actions', 'Gestion sous Mandat', 'Produits Structurés'],
  agressif: ['Produits Structurés', 'OPCVM Actions', 'Gestion sous Mandat'],
};

const SimulationsPage = () => {
  const {
    behaviorProfile,
    profileType,
    accountBalance,
    totalInvested,
    globalROI,
    actions,
    validators
  } = useSharedData();

  const [form, setForm] = useState({
    initialCapital: '',
    duration: '12',
    riskProfile: profileType || 'modere',
  });
  const [result, setResult] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSimulate = () => {
    // Calculate 3 scenarios: pessimistic, expected, optimistic
    const capital = parseFloat(form.initialCapital) || 0;
    const years = parseInt(form.duration, 10) / 12;
    const profile = riskProfiles.find((r) => r.value === form.riskProfile) || riskProfiles[1];
    const rate = profile.rate;
    
    // Enhanced calculation with user's current performance data
    const userROIBonus = globalROI > 0 ? 0.01 : 0; // 1% bonus if user has positive ROI
    const adjustedRate = rate + userROIBonus;
    
    // Pessimistic: 60% of rate, Expected: adjusted rate, Optimistic: 140% of rate
    const pessimistic = Math.round(capital * Math.pow(1 + adjustedRate * 0.6, years));
    const expected = Math.round(capital * Math.pow(1 + adjustedRate, years));
    const optimistic = Math.round(capital * Math.pow(1 + adjustedRate * 1.4, years));
    
    const simulationResult = {
      pessimistic,
      expected,
      optimistic,
      products: productRecommendations[form.riskProfile] || [],
      profileLabel: profile.label,
      userROIBonus,
      canAfford: validators.canInvest(capital),
      basedOnCurrentPerformance: globalROI > 0,
      projectedAnnualReturn: (adjustedRate * 100).toFixed(2)
    };
    
    setResult(simulationResult);
    
    // Save simulation to shared data
    actions.addSimulation({
      initialCapital: capital,
      duration: form.duration,
      riskProfile: form.riskProfile,
      result: simulationResult
    });
  };

  return (
    <div className="flex w-full gap-8 justify-center mt-8" >
      <div className="bg-white/5 border border-white/20 rounded-xl p-6 w-full md:max-w-2xl">
        <h3 className="text-xl font-semibold text-white mb-6">Simulation d'investissement</h3>
        
        {/* User Context Info */}
        {validators.hasCompleteProfile() && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <h4 className="text-blue-400 font-medium mb-2">📊 Basé sur votre profil</h4>
            <div className="text-sm text-white/80 space-y-1">
              <p>• Solde disponible: {accountBalance.toLocaleString()} MAD</p>
              <p>• Total investi: {totalInvested.toLocaleString()} MAD</p>
              <p>• Performance actuelle: {globalROI.toFixed(2)}%</p>
              <p>• Profil de risque: {profileType || 'Non défini'}</p>
            </div>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Capital initial (MAD)</label>
            <input
              type="number"
              value={form.initialCapital}
              onChange={(e) => handleChange('initialCapital', e.target.value)}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/60 focus:outline-none transition-colors"
              placeholder="10000"
              min={0}
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Durée</label>
            <select
              value={form.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white focus:border-white/60 focus:outline-none transition-colors"
            >
              <option value="6">6 mois</option>
              <option value="12">1 an</option>
              <option value="24">2 ans</option>
              <option value="60">5 ans</option>
            </select>
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Profil de risque</label>
            <select
              value={form.riskProfile}
              onChange={(e) => handleChange('riskProfile', e.target.value)}
              className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white focus:border-white/60 focus:outline-none transition-colors"
            >
              {riskProfiles.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSimulate}
              disabled={!form.initialCapital || parseFloat(form.initialCapital) <= 0}
              className="flex-1 bg-[#3CD4AB] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#89559F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lancer la simulation
            </button>
            
            {result && validators.canInvest(parseFloat(form.initialCapital)) && (
              <button
                onClick={() => {
                  const amount = parseFloat(form.initialCapital);
                  actions.buyInvestment({
                    nameProduct: `Simulation ${form.riskProfile}`,
                    category: 'simulation',
                    riskLevel: form.riskProfile
                  }, amount);
                }}
                className="px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                title="Investir ce montant"
              >
                💰 Investir
              </button>
            )}
          </div>
          
          {!validators.canInvest(parseFloat(form.initialCapital)) && form.initialCapital && (
            <p className="text-red-400 text-sm mt-2">
              ⚠️ Solde insuffisant. Solde disponible: {accountBalance.toLocaleString()} MAD
            </p>
          )}
        </div>
      </div>

      {result && (
        <div className="bg-white/10 border border-white/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Résultats & recommandations</h4>
            {result.basedOnCurrentPerformance && (
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                ✨ Optimisé par vos performances
              </span>
            )}
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
              <p>Profil: <span className="text-white">{result.profileLabel}</span></p>
              <p>Rendement projeté: <span className="text-white">{result.projectedAnnualReturn}%</span></p>
              {result.userROIBonus > 0 && (
                <p className="col-span-2 text-green-400">
                  +1% bonus basé sur vos performances actuelles ({globalROI.toFixed(2)}%)
                </p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-[#191930] rounded-lg p-4 text-center border border-red-500/30">
              <div className="text-red-300 text-xs mb-1">Scénario pessimiste</div>
              <div className="text-2xl font-bold text-red-400">{result.pessimistic.toLocaleString()} MAD</div>
              <div className="text-red-300/70 text-xs mt-1">
                +{((result.pessimistic - parseFloat(form.initialCapital)) / parseFloat(form.initialCapital) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-[#191930] rounded-lg p-4 text-center border border-[#3CD4AB]/30">
              <div className="text-[#3CD4AB]/70 text-xs mb-1">Scénario attendu</div>
              <div className="text-2xl font-bold text-[#3CD4AB]">{result.expected.toLocaleString()} MAD</div>
              <div className="text-[#3CD4AB]/70 text-xs mt-1">
                +{((result.expected - parseFloat(form.initialCapital)) / parseFloat(form.initialCapital) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-[#191930] rounded-lg p-4 text-center border border-green-500/30">
              <div className="text-green-300 text-xs mb-1">Scénario optimiste</div>
              <div className="text-2xl font-bold text-green-400">{result.optimistic.toLocaleString()} MAD</div>
              <div className="text-green-300/70 text-xs mt-1">
                +{((result.optimistic - parseFloat(form.initialCapital)) / parseFloat(form.initialCapital) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
          
          {!result.canAfford && (
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4 mb-4">
              <p className="text-orange-400 text-sm">
                ⚠️ Montant supérieur à votre solde actuel ({accountBalance.toLocaleString()} MAD)
              </p>
            </div>
          )}
          
          <div className="mt-4">
            <div className="text-white/80 font-medium mb-2">Produits recommandés pour votre profil ({result.profileLabel}) :</div>
            <div className="flex flex-wrap gap-2">
              {result.products.map((product, idx) => (
                <span key={idx} className="bg-[#3CD4AB]/20 text-[#3CD4AB] px-3 py-1 rounded-full text-sm">
                  {product}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationsPage;