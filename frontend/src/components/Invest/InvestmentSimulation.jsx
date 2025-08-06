import React, { useState, useEffect } from 'react';
import { 
  IoCalculator,
  IoTrendingUp,
  IoTrendingDown,
  IoInformationCircle,
  IoAdd
} from 'react-icons/io5';

const InvestmentSimulation = () => {
  const [montantInitial, setMontantInitial] = useState(10000);
  const [investissementMensuel, setInvestissementMensuel] = useState(1000);
  const [duree, setDuree] = useState(5);
  const [rendementAnnuel, setRendementAnnuel] = useState(5);
  const [simulationResults, setSimulationResults] = useState(null);
  const [soldeDisponible] = useState(80025000);

  // Calculate simulation results
  useEffect(() => {
    const calculateProjection = () => {
      const monthlyRate = rendementAnnuel / 100 / 12;
      const totalMonths = duree * 12;
      
      // Future value of initial investment
      const futureValueInitial = montantInitial * Math.pow(1 + monthlyRate, totalMonths);
      
      // Future value of monthly investments (annuity)
      const futureValueMonthly = investissementMensuel * 
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
      
      const valeurFinaleEstimee = futureValueInitial + futureValueMonthly;
      const totalInvesti = montantInitial + (investissementMensuel * totalMonths);
      const gains = valeurFinaleEstimee - totalInvesti;
      
      // Risk scenarios
      const optimiste = valeurFinaleEstimee * 1.15; // +15%
      const realiste = valeurFinaleEstimee;
      const pessimiste = valeurFinaleEstimee * 0.85; // -15%
      
      setSimulationResults({
        valeurFinaleEstimee: Math.round(valeurFinaleEstimee),
        totalInvesti: Math.round(totalInvesti),
        gains: Math.round(gains),
        scenarios: {
          optimiste: Math.round(optimiste),
          realiste: Math.round(realiste),
          pessimiste: Math.round(pessimiste)
        }
      });
    };
    
    calculateProjection();
  }, [montantInitial, investissementMensuel, duree, rendementAnnuel]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0
    }).format(amount).replace('MAD', 'Dhs');
  };

  const formatLargeCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(3)} Dhs`;
    }
    return formatCurrency(amount);
  };

  return (
    <div className="min-h-screen bg-bg-dark text-white font-raleway">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-bg-dark/95 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold">Simulations</h1>
            <p className="text-sm text-gray-400">Simulateur d'investissement</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Solde disponible</p>
              <p className="text-lg font-bold text-accent">{formatLargeCurrency(soldeDisponible)}</p>
            </div>
            <button className="bg-accent text-bg-dark px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors">
              <IoAdd className="w-4 h-4 inline mr-1" />
              Ajouter
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Simulateur d'Investissement */}
          <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-2 mb-6">
              <IoCalculator className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-bold">Simulateur d'Investissement</h2>
            </div>

            <div className="space-y-4">
              {/* Montant Initial */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Montant Initial
                </label>
                <input
                  type="number"
                  value={montantInitial}
                  onChange={(e) => setMontantInitial(Number(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                  placeholder="10,000 Dhs"
                />
              </div>

              {/* Investissement Mensuel */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investissement Mensuel
                </label>
                <input
                  type="number"
                  value={investissementMensuel}
                  onChange={(e) => setInvestissementMensuel(Number(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                  placeholder="1,000 Dhs"
                />
              </div>

              {/* Durée */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Durée (années)
                </label>
                <select
                  value={duree}
                  onChange={(e) => setDuree(Number(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                >
                  <option value={1}>1 an</option>
                  <option value={2}>2 ans</option>
                  <option value={3}>3 ans</option>
                  <option value={5}>5 ans</option>
                  <option value={10}>10 ans</option>
                  <option value={15}>15 ans</option>
                  <option value={20}>20 ans</option>
                </select>
              </div>

              {/* Rendement Annuel Espéré */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rendement Annuel Espéré
                </label>
                <select
                  value={rendementAnnuel}
                  onChange={(e) => setRendementAnnuel(Number(e.target.value))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent"
                >
                  <option value={3}>3% (Conservateur)</option>
                  <option value={5}>5% (Conservateur)</option>
                  <option value={7}>7% (Modéré)</option>
                  <option value={10}>10% (Agressif)</option>
                  <option value={12}>12% (Très Agressif)</option>
                </select>
              </div>

              {/* Calculer Button */}
              <button className="w-full bg-accent text-bg-dark py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors shadow-lg">
                Calculer la Projection
              </button>
            </div>
          </div>

          {/* Résultats de Simulation */}
          <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-6">Résultats de Simulation</h2>
            
            {simulationResults && (
              <div className="space-y-6">
                {/* Valeur Finale Estimée */}
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Valeur Finale Estimée</p>
                  <p className="text-3xl font-bold text-accent">
                    {formatCurrency(simulationResults.valeurFinaleEstimee)}
                  </p>
                </div>

                {/* Total Investi et Gains */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">Total Investi</p>
                    <p className="text-lg font-bold text-white">
                      {formatCurrency(simulationResults.totalInvesti)}
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">Gains</p>
                    <p className="text-lg font-bold text-green-400">
                      {formatCurrency(simulationResults.gains)}
                    </p>
                  </div>
                </div>

                {/* Simple Chart Visualization */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="h-32 relative">
                    <div className="absolute inset-0 flex items-end justify-between">
                      {Array.from({ length: duree }, (_, i) => {
                        const year = i + 1;
                        const progress = (year / duree) * 100;
                        const value = montantInitial + (investissementMensuel * 12 * year);
                        return (
                          <div key={year} className="flex flex-col items-center">
                            <div 
                              className="bg-accent rounded-sm w-6 mb-1"
                              style={{ height: `${progress}%` }}
                            />
                            <span className="text-xs text-gray-400">{year}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scénarios de Risque */}
        {simulationResults && (
          <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-6">Scénarios de Risque</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Optimiste */}
              <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-4 text-center">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Optimiste</h3>
                <p className="text-2xl font-bold text-green-400 mb-1">+15%</p>
                <p className="text-sm text-gray-300">{formatCurrency(simulationResults.scenarios.optimiste)}</p>
              </div>

              {/* Réaliste */}
              <div className="bg-blue-900/20 border border-accent/20 rounded-xl p-4 text-center">
                <h3 className="text-lg font-semibold text-accent mb-2">Réaliste</h3>
                <p className="text-2xl font-bold text-accent mb-1">+8%</p>
                <p className="text-sm text-gray-300">{formatCurrency(simulationResults.scenarios.realiste)}</p>
              </div>

              {/* Pessimiste */}
              <div className="bg-orange-900/20 border border-orange-500/20 rounded-xl p-4 text-center">
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Pessimiste</h3>
                <p className="text-2xl font-bold text-orange-400 mb-1">+3%</p>
                <p className="text-sm text-gray-300">{formatCurrency(simulationResults.scenarios.pessimiste)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Opportunités Recommandées */}
        <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold mb-6">Opportunités Recommandées</h2>
          <div className="space-y-4">
            {[
              {
                name: "ETF Maroc",
                description: "ETF diversifié sur le marché marocain",
                return: "8.5%",
                risk: "Diversifié",
                category: "ETF"
              },
              {
                name: "Obligations d'État",
                description: "Obligations sécurisées du gouvernement",
                return: "4.2%",
                risk: "Fixed Income",
                category: "Obligations"
              },
              {
                name: "Actions Tech",
                description: "Portefeuille d'actions technologiques",
                return: "12.3%",
                risk: "Technologie",
                category: "Actions"
              },
              {
                name: "REIT Immobilier",
                description: "Fonds d'investissement immobilier",
                return: "7.8%",
                risk: "Immobilier",
                category: "REIT"
              }
            ].map((opportunity, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{opportunity.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{opportunity.description}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {opportunity.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        Risque: {opportunity.risk}
                      </span>
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-lg font-bold text-accent">{opportunity.return}</p>
                  </div>
                  <button className="bg-accent text-bg-dark px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors">
                    Investir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSimulation; 