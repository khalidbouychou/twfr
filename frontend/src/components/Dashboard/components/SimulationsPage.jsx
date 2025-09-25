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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Simulations</h1>
        <p className="text-white/60">
          Testez vos stratégies d'investissement sans risque
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Créer une Simulation */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-6">
            Créer une Simulation
          </h3>
          <div className="space-y-4">
            {/* Balance Info */}
            <div className="p-3 bg-[#3CD4AB]/10 border border-[#3CD4AB]/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">
                  Solde disponible:
                </span>
                <span className="text-[#3CD4AB] font-semibold">
                  {userBalance.toLocaleString()} MAD
                </span>
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
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
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none"
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
              <label className="block text-white/80 text-sm font-medium mb-2">
                Durée
              </label>
              <select
                value={simulationForm.duration}
                onChange={(e) =>
                  handleSimulationFormChange("duration", e.target.value)
                }
                className="w-full bg-[#0F0F19] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#3CD4AB] focus:outline-none"
                style={{
                  backgroundColor: "#0F0F19",
                  color: "white"
                }}
              >
                <option
                  value="6"
                  style={{
                    backgroundColor: "#0F0F19",
                    color: "white"
                  }}
                >
                  6 mois
                </option>
                <option
                  value="12"
                  style={{
                    backgroundColor: "#0F0F19",
                    color: "white"
                  }}
                >
                  1 an
                </option>
                <option
                  value="24"
                  style={{
                    backgroundColor: "#0F0F19",
                    color: "white"
                  }}
                >
                  2 ans
                </option>
                <option
                  value="60"
                  style={{
                    backgroundColor: "#0F0F19",
                    color: "white"
                  }}
                >
                  5 ans
                </option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Profil de Risque
              </label>
              <select
                value={simulationForm.riskProfile}
                onChange={(e) =>
                  handleSimulationFormChange("riskProfile", e.target.value)
                }
                className="w-full bg-[#0F0F19] border border-white/20 rounded-lg px-4 py-2 text-white focus:border-[#3CD4AB] focus:outline-none"
                style={{
                  backgroundColor: "#0F0F19",
                  color: "white"
                }}
              >
                <option
                  value="conservateur"
                  style={{
                    backgroundColor: "#0F0F19",
                    color: "white"
                  }}
                >
                  Conservateur (4% annuel)
                </option>
                <option
                  value="modere"
                  style={{
                    backgroundColor: "#0F0F19",
                    color: "white"
                  }}
                >
                  Modéré (7% annuel)
                </option>
                <option
                  value="dynamique"
                  style={{
                    backgroundColor: "#0F0F19",
                    color: "white"
                  }}
                >
                  Dynamique (10% annuel)
                </option>
                <option
                  value="agressif"
                  style={{
                    backgroundColor: "#0F0F19",
                    color: "white"
                  }}
                >
                  Agressif (15% annuel)
                </option>
              </select>
            </div>

            <button
              onClick={handleCreateSimulation}
              disabled={
                !simulationForm.initialCapital ||
                parseFloat(simulationForm.initialCapital) <= 0 ||
                parseFloat(simulationForm.initialCapital) > userBalance
              }
              className="w-full bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lancer la Simulation
            </button>
          </div>
        </div>

        {/* Simulations Actives */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-6">
            Simulations Actives
          </h3>
          <div className="space-y-4">
            {recentSimulations
              .filter((sim) => sim.status === "active")
              .slice(0, 3)
              .map((sim) => (
                <div
                  key={sim.id}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium">
                      {sim.name}
                    </h4>
                    <span
                      className={`font-semibold ${
                        sim.performance >= 0
                          ? "text-[#3CD4AB]"
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
                      <div className="text-[#3CD4AB]">
                        {sim.currentValue.toLocaleString()} MAD
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-white/60">
                      Durée: {sim.duration}
                    </div>
                    <div className="text-xs text-white/60">
                      Créé le {sim.createdAt}
                    </div>
                  </div>
                </div>
              ))}
            {recentSimulations.filter((sim) => sim.status === "active").length === 0 && (
              <div className="text-center text-white/60 py-4">
                Aucune simulation active
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Simulations Section */}
      <div className="p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">
            Simulations Récentes
          </h3>
          <div className="flex items-center space-x-2">
            <label className="text-white/60 text-sm">Filtrer par:</label>
            <select
              value={simulationDateFilter}
              onChange={(e) => setSimulationDateFilter(e.target.value)}
              className="bg-[#0F0F19] border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:border-[#3CD4AB] focus:outline-none"
              style={{
                backgroundColor: "#0F0F19",
                color: "white"
              }}
            >
              <option
                value="all"
                style={{ backgroundColor: "#0F0F19", color: "white" }}
              >
                Toutes
              </option>
              <option
                value="today"
                style={{ backgroundColor: "#0F0F19", color: "white" }}
              >
                Aujourd'hui
              </option>
              <option
                value="week"
                style={{ backgroundColor: "#0F0F19", color: "white" }}
              >
                Cette semaine
              </option>
              <option
                value="month"
                style={{ backgroundColor: "#0F0F19", color: "white" }}
              >
                Ce mois
              </option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getFilteredSimulations().map((simulation) => (
            <div
              key={simulation.id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              <div className="flex justify-between items-start mb-3">
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
                        ? "text-[#3CD4AB]"
                        : "text-red-400"
                    }`}
                  >
                    {simulation.performance >= 0 ? "+" : ""}
                    {simulation.performance}%
                  </span>
                  <div
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      simulation.status === "active"
                        ? "bg-[#3CD4AB]/20 text-[#3CD4AB]"
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
                  <span className="text-[#3CD4AB]">
                    {simulation.currentValue.toLocaleString()} MAD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Durée:</span>
                  <span className="text-white">{simulation.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Créé le:</span>
                  <span className="text-white">{simulation.createdAt}</span>
                </div>
              </div>
            </div>
          ))}

          {getFilteredSimulations().length === 0 && (
            <div className="col-span-full text-center text-white/60 py-8">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              <p>Aucune simulation trouvée pour cette période</p>
              <p className="text-sm mt-1">
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