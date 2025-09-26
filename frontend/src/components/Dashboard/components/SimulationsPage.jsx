import React from 'react';

const SimulationsPage = ({
  userBalance,
  simulationForm,
  handleSimulationFormChange,
  handleCreateSimulation,
  recentSimulations,
  simulationDateFilter,
  setSimulationDateFilter,
  getFilteredSimulations
}) => {
  return (
    <div className="space-y-8">
      {/* Simple Header */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Créer une Simulation */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            Créer une Simulation
          </h3>
          <div className="space-y-4">
            {/* Balance Info */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-white text-sm">
                  Solde disponible:
                </span>
                <span className="text-white font-semibold">
                  {userBalance.toLocaleString()} MAD
                </span>
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Capital Initial (MAD)
              </label>
              <input
                type="number"
                value={simulationForm.initialCapital}
                onChange={(e) =>
                  handleSimulationFormChange(
                    "initialCapital",
                    e.target.value
                  )
                }
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-white/60 focus:outline-none transition-colors"
                placeholder="10000"
                max={userBalance}
              />
              {simulationForm.initialCapital &&
                parseFloat(simulationForm.initialCapital) > userBalance && (
                  <p className="text-red-400 text-sm mt-1">
                    Capital supérieur au solde disponible
                  </p>
                )}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Durée
              </label>
              <select
                value={simulationForm.duration}
                onChange={(e) =>
                  handleSimulationFormChange("duration", e.target.value)
                }
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white focus:border-white/60 focus:outline-none transition-colors"
              >
                <option value="6">6 mois</option>
                <option value="12">1 an</option>
                <option value="24">2 ans</option>
                <option value="60">5 ans</option>
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Profil de Risque
              </label>
              <select
                value={simulationForm.riskProfile}
                onChange={(e) =>
                  handleSimulationFormChange("riskProfile", e.target.value)
                }
                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white focus:border-white/60 focus:outline-none transition-colors"
              >
                <option value="conservateur">Conservateur (4% annuel)</option>
                <option value="modere">Modéré (7% annuel)</option>
                <option value="dynamique">Dynamique (10% annuel)</option>
                <option value="agressif">Agressif (15% annuel)</option>
              </select>
            </div>

            <button
              onClick={handleCreateSimulation}
              disabled={
                !simulationForm.initialCapital ||
                parseFloat(simulationForm.initialCapital) <= 0 ||
                parseFloat(simulationForm.initialCapital) > userBalance
              }
              className="w-full bg-white text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lancer la Simulation
            </button>
          </div>
        </div>

        {/* Simulations Actives */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            Simulations Actives
          </h3>
          <div className="space-y-4">
            {recentSimulations
              .filter((sim) => sim.status === "active")
              .slice(0, 3)
              .map((sim) => (
                <div
                  key={sim.id}
                  className="bg-white/10 border border-white/20 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-white font-medium">
                      {sim.name}
                    </h4>
                    <span
                      className={`font-semibold ${
                        sim.performance >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {sim.performance >= 0 ? "+" : ""}
                      {sim.performance}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Capital initial</span>
                      <div className="text-white">
                        {sim.initialCapital.toLocaleString()} MAD
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">Valeur actuelle</span>
                      <div className="text-white font-semibold">
                        {sim.currentValue.toLocaleString()} MAD
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                    <div className="text-xs text-white/60">
                      Durée: {sim.duration}
                    </div>
                    <div className="text-xs text-white/60">
                      {sim.createdAt}
                    </div>
                  </div>
                </div>
              ))}
            {recentSimulations.filter((sim) => sim.status === "active").length === 0 && (
              <div className="text-center text-white/60 py-8">
                <div className="text-4xl mb-2">📊</div>
                <p>Aucune simulation active</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Simulations Section */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            Simulations Récentes
          </h3>
          <div className="flex items-center space-x-3">
            <label className="text-white text-sm">Filtrer par:</label>
            <select
              value={simulationDateFilter}
              onChange={(e) => setSimulationDateFilter(e.target.value)}
              className="bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:border-white/60 focus:outline-none"
            >
              <option value="all">Toutes</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getFilteredSimulations().map((simulation) => (
            <div
              key={simulation.id}
              className="bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-white font-medium">
                    {simulation.name}
                  </h4>
                  <p className="text-white/60 text-sm">
                    {simulation.riskProfile}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`font-semibold text-lg ${
                      simulation.performance >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {simulation.performance >= 0 ? "+" : ""}
                    {simulation.performance}%
                  </span>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium mt-1 ${
                      simulation.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {simulation.status === "active" ? "Actif" : "Terminé"}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Capital initial:</span>
                  <span className="text-white">
                    {simulation.initialCapital.toLocaleString()} MAD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Valeur actuelle:</span>
                  <span className="text-white font-semibold">
                    {simulation.currentValue.toLocaleString()} MAD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Durée:</span>
                  <span className="text-white">{simulation.duration}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 mt-3">
                  <span className="text-white/60">Créé le:</span>
                  <span className="text-white">{simulation.createdAt}</span>
                </div>
              </div>
            </div>
          ))}

          {getFilteredSimulations().length === 0 && (
            <div className="col-span-full text-center text-white/60 py-12">
              <div className="text-6xl mb-4">📈</div>
              <p className="text-lg mb-2">Aucune simulation trouvée</p>
              <p className="text-sm">
                Créez une nouvelle simulation pour commencer
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationsPage;