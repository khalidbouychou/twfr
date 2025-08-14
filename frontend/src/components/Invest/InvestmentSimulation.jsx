import React, { useState, useEffect } from 'react';
import { ROICalculator } from '../Algo';

const InvestmentSimulation = () => {
  const [formData, setFormData] = useState({
    initialCapital: '',
    monthlyContribution: '',
    annualReturn: 7,
    years: 5,
    riskProfile: 'modere'
  });

  const [simulationResults, setSimulationResults] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const calculateProjection = () => {
    const capital = parseFloat(formData.initialCapital) || 0;
    const monthly = parseFloat(formData.monthlyContribution) || 0;
    const annual = parseFloat(formData.annualReturn);
    const years = parseInt(formData.years);

    if (capital <= 0 && monthly <= 0) return;

    // Use ROICalculator for more accurate calculations
    let results;
    if (monthly > 0) {
      results = ROICalculator.calculateCompoundROI(capital, monthly, annual, years);
    } else {
      results = ROICalculator.calculateSimpleROI(capital, annual, years);
    }

    // Calculate additional scenarios
    const scenarios = ROICalculator.calculateROIScenarios(capital, annual, years);
    const riskAdjusted = ROICalculator.calculateRiskAdjustedROI(annual, 8); // Default volatility
    const netROI = ROICalculator.calculateNetROI(capital, annual, years, 1.5); // Default 1.5% fees

    setSimulationResults({
      ...results,
      scenarios,
      riskAdjusted,
      netROI,
      monthlyContribution: monthly
    });
  };

  useEffect(() => {
    calculateProjection();
  }, [formData]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatLargeCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M Dhs`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K Dhs`;
    }
    return formatCurrency(amount);
  };

  const getRiskProfileColor = (profile) => {
    const colors = {
      conservateur: 'text-blue-500',
      modere: 'text-green-500',
      dynamique: 'text-yellow-500',
      agressif: 'text-red-500'
    };
    return colors[profile] || 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-[#0F0F19] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Simulateur d'Investissement
          </h1>
          <p className="text-lg text-gray-300">
            Calculez le rendement potentiel de vos investissements avec des projections détaillées
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Paramètres d'Investissement</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Capital Initial (Dhs)
                </label>
                <input
                  type="number"
                  value={formData.initialCapital}
                  onChange={(e) => setFormData({...formData, initialCapital: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none"
                  placeholder="10000"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Contribution Mensuelle (Dhs)
                </label>
                <input
                  type="number"
                  value={formData.monthlyContribution}
                  onChange={(e) => setFormData({...formData, monthlyContribution: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Rendement Annuel (%)
                </label>
                <input
                  type="number"
                  value={formData.annualReturn}
                  onChange={(e) => setFormData({...formData, annualReturn: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Durée (Années)
                </label>
                <input
                  type="number"
                  value={formData.years}
                  onChange={(e) => setFormData({...formData, years: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none"
                  min="1"
                  max="30"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Profil de Risque
                </label>
                <select
                  value={formData.riskProfile}
                  onChange={(e) => setFormData({...formData, riskProfile: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-[#3CD4AB] focus:outline-none"
                >
                  <option value="conservateur">Conservateur (3-5%)</option>
                  <option value="modere">Modéré (5-8%)</option>
                  <option value="dynamique">Dynamique (8-12%)</option>
                  <option value="agressif">Agressif (12-18%)</option>
                </select>
              </div>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {showAdvanced ? 'Masquer' : 'Afficher'} Options Avancées
              </button>

              {showAdvanced && (
                <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Taux d'Inflation (%)
                    </label>
                    <input
                      type="number"
                      value="2"
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/60"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Frais Annuels (%)
                    </label>
                    <input
                      type="number"
                      value="1.5"
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/60"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Projections et ROI</h2>
            
            {simulationResults ? (
              <div className="space-y-6">
                {/* Main Results */}
                <div className="p-4 bg-[#3CD4AB]/10 border border-[#3CD4AB]/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#3CD4AB] mb-3">Résultats Principaux</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Capital Final:</span>
                      <div className="text-white font-semibold text-lg">
                        {formatLargeCurrency(simulationResults.finalValue)}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">ROI Total:</span>
                      <div className={`text-lg font-semibold ${ROICalculator.getROIColor(simulationResults.roiPercentage)}`}>
                        {ROICalculator.formatROI(simulationResults.roiPercentage)}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">ROI Annuel Moyen:</span>
                      <div className={`text-lg font-semibold ${ROICalculator.getROIColor(simulationResults.averageAnnualROI)}`}>
                        {ROICalculator.formatROI(simulationResults.averageAnnualROI)}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">Gain Total:</span>
                      <div className="text-white font-semibold text-lg">
                        {formatLargeCurrency(simulationResults.totalReturn)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROI Scenarios */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3">Scénarios ROI</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-red-400 font-semibold">
                        {ROICalculator.formatROI(simulationResults.scenarios.pessimistic.roiPercentage)}
                      </div>
                      <div className="text-white/60 text-xs">Pessimiste</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400 font-semibold">
                        {ROICalculator.formatROI(simulationResults.scenarios.realistic.roiPercentage)}
                      </div>
                      <div className="text-white/60 text-xs">Réaliste</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-semibold">
                        {ROICalculator.formatROI(simulationResults.scenarios.optimistic.roiPercentage)}
                      </div>
                      <div className="text-white/60 text-xs">Optimiste</div>
                    </div>
                  </div>
                </div>

                {/* Risk-Adjusted Metrics */}
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">Métriques Ajustées au Risque</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Ratio de Sharpe:</span>
                      <div className="text-white font-semibold">
                        {simulationResults.riskAdjusted.sharpeRatio}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">ROI Ajusté:</span>
                      <div className={`font-semibold ${ROICalculator.getROIColor(simulationResults.riskAdjusted.riskAdjustedReturn)}`}>
                        {ROICalculator.formatROI(simulationResults.riskAdjusted.riskAdjustedReturn)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net ROI after Fees */}
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-400 mb-3">ROI Net (Après Frais)</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">ROI Net:</span>
                      <div className={`font-semibold ${ROICalculator.getROIColor(simulationResults.netROI.netROIPercentage)}`}>
                        {ROICalculator.formatROI(simulationResults.netROI.netROIPercentage)}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">Frais Totaux:</span>
                      <div className="text-white font-semibold">
                        {formatCurrency(simulationResults.netROI.totalFees)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-white/60 py-8">
                <p>Entrez vos paramètres pour voir les projections</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSimulation; 