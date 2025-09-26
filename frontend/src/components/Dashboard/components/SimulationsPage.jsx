import React, { useContext, useState } from 'react';
import { UserContext } from '../../Context/UserContext.jsx';


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
  const { userContext } = useContext(UserContext);
  const userProfile = userContext;
  const [form, setForm] = useState({
    initialCapital: '',
    duration: '12',
    riskProfile: userProfile?.behaviorProfile?.profileType || 'modere',
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
    // Pessimistic: 60% of rate, Expected: rate, Optimistic: 140% of rate
    const pessimistic = Math.round(capital * Math.pow(1 + rate * 0.6, years));
    const expected = Math.round(capital * Math.pow(1 + rate, years));
    const optimistic = Math.round(capital * Math.pow(1 + rate * 1.4, years));
    setResult({
      pessimistic,
      expected,
      optimistic,
      products: productRecommendations[form.riskProfile] || [],
      profileLabel: profile.label,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Simulation simple</h3>
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
          <button
            onClick={handleSimulate}
            disabled={!form.initialCapital || parseFloat(form.initialCapital) <= 0}
            className="w-full bg-[#3CD4AB] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#89559F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            Lancer la simulation
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white/10 border border-white/20 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Résultats & recommandations</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-[#191930] rounded-lg p-4 text-center">
              <div className="text-white/70 text-xs mb-1">Scénario pessimiste</div>
              <div className="text-2xl font-bold text-red-400">{result.pessimistic.toLocaleString()} MAD</div>
            </div>
            <div className="bg-[#191930] rounded-lg p-4 text-center">
              <div className="text-white/70 text-xs mb-1">Scénario attendu</div>
              <div className="text-2xl font-bold text-[#3CD4AB]">{result.expected.toLocaleString()} MAD</div>
            </div>
            <div className="bg-[#191930] rounded-lg p-4 text-center">
              <div className="text-white/70 text-xs mb-1">Scénario optimiste</div>
              <div className="text-2xl font-bold text-green-400">{result.optimistic.toLocaleString()} MAD</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-white/80 font-medium mb-2">Produits recommandés pour votre profil ({result.profileLabel}) :</div>
            <ul className="list-disc list-inside text-white/70">
              {result.products.map((prod) => (
                <li key={prod}>{prod}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationsPage;