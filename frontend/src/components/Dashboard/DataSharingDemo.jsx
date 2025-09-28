import React, { useState, useEffect } from 'react';
import { useSharedData } from '../Context/useSharedData.js';
import SharedDataExample from './components/SharedDataExample';
import SimulationsPage from './components/SimulationsPage';

/**
 * Complete Data Sharing Demo Dashboard
 * Demonstrates real-time data synchronization across multiple components
 */
const DataSharingDemo = () => {
  const {
    // User data
    fullname,
    isProfileComplete,
    accountBalance,
    
    // Investment data
    userInvestments,
    totalInvested,
    totalCurrent,
    totalProfit,
    globalROI,
    
    // Real-time status
    realTimeUpdates,
    
    // Actions for demo
    actions,
    validators
  } = useSharedData();

  const [activeTab, setActiveTab] = useState('overview');
  const [demoMode, setDemoMode] = useState(false);

  // Initialize demo data if no real data exists
  const initializeDemoData = () => {
    if (!demoMode) {
      // Add demo profile
      actions.updateUserProfile({
        fullName: 'Demo User',
        email: 'demo@tawfir.ma',
        phone: '+212-600-000-000'
      });

      // Add demo balance
      actions.updateAccountBalance(100000); // 100,000 MAD

      // Add demo investments
      const demoInvestments = [
        {
          nameProduct: 'OPCVM Actions Maroc',
          category: 'stocks',
          riskLevel: 'dynamic',
          valueInvested: 25000,
          currentValue: 26500,
          roi_product: 12.5,
          picture: '/opcvm.jpg'
        },
        {
          nameProduct: 'Gestion sous Mandat',
          category: 'managed',
          riskLevel: 'moderate',
          valueInvested: 30000,
          currentValue: 31200,
          roi_product: 8.3,
          picture: '/managed.jpg'
        },
        {
          nameProduct: 'Dépôt à Terme',
          category: 'savings',
          riskLevel: 'conservative',
          valueInvested: 15000,
          currentValue: 15450,
          roi_product: 4.2,
          picture: '/deposit.jpg'
        }
      ];

      demoInvestments.forEach(inv => actions.buyInvestment(inv, inv.valueInvested));

      // Add demo goals
      actions.createGoal('Achat Voiture', 200000, new Date(Date.now() + 365*24*60*60*1000).toISOString());
      actions.createGoal('Épargne Retraite', 1000000, new Date(Date.now() + 10*365*24*60*60*1000).toISOString());

      // Update risk profile
      actions.updateRiskProfile('moderate');

      setDemoMode(true);
    }
  };

  // Reset demo data
  const resetDemoData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const tabContent = {
    overview: <SharedDataExample />,
    simulations: <SimulationsPage />,
    realtime: <RealTimeMonitor />,
    analytics: <AnalyticsDashboard />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F19] via-[#1a1a2e] to-[#16213e] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🚀 Système de Partage de Données en Temps Réel
              </h1>
              <p className="text-white/70">
                Démonstration complète de la synchronisation des données entre tous les composants
              </p>
            </div>
            
            <div className="flex gap-3">
              {!demoMode && (
                <button
                  onClick={initializeDemoData}
                  className="px-4 py-2 bg-[#3CD4AB] hover:bg-[#89559F] text-white rounded-lg transition-colors"
                >
                  🎮 Activer Mode Demo
                </button>
              )}
              
              {demoMode && (
                <button
                  onClick={resetDemoData}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  🔄 Reset Demo
                </button>
              )}
            </div>
          </div>
          
          {/* Status Bar */}
          <div className="flex items-center gap-6 mt-4 p-4 bg-white/10 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${realTimeUpdates?.enabled ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-white/80 text-sm">
                Temps Réel: {realTimeUpdates?.enabled ? 'Actif' : 'Inactif'}
              </span>
            </div>
            
            <div className="text-white/80 text-sm">
              Utilisateur: {fullname || 'Non connecté'}
            </div>
            
            <div className="text-white/80 text-sm">
              Solde: {accountBalance?.toLocaleString() || 0} MAD
            </div>
            
            <div className="text-white/80 text-sm">
              Investissements: {userInvestments?.length || 0}
            </div>
            
            <div className="text-white/80 text-sm">
              ROI Global: {globalROI?.toFixed(2) || 0}%
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-2 mb-8">
          <div className="flex gap-2">
            {[
              { id: 'overview', label: '📊 Vue d\'ensemble', icon: '📊' },
              { id: 'simulations', label: '🎯 Simulations', icon: '🎯' },
              { id: 'realtime', label: '⚡ Temps Réel', icon: '⚡' },
              { id: 'analytics', label: '📈 Analytics', icon: '📈' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#3CD4AB] text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {tabContent[activeTab]}
        </div>

        {/* Footer Info */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">💡 Fonctionnalités Démontrées</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-white/80">
            <div>
              <strong className="text-white">Partage de Données:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Synchronisation automatique</li>
                <li>État global partagé</li>
                <li>Mises à jour en temps réel</li>
              </ul>
            </div>
            <div>
              <strong className="text-white">Analytics Avancées:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Calculs automatiques ROI</li>
                <li>Analyse de performance</li>
                <li>Score de santé financière</li>
              </ul>
            </div>
            <div>
              <strong className="text-white">Intégration Complète:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Tous composants connectés</li>
                <li>Validation de données</li>
                <li>Actions centralisées</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Real-time monitoring component
const RealTimeMonitor = () => {
  const { 
    userInvestments, 
    realTimeUpdates, 
    actions, 
    performanceHistory,
    totalCurrent,
    totalProfit 
  } = useSharedData();
  
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (realTimeUpdates?.enabled && userInvestments?.length > 0) {
        const newUpdate = {
          timestamp: new Date().toLocaleTimeString(),
          message: `Portfolio mis à jour: ${totalCurrent?.toLocaleString()} MAD (${totalProfit >= 0 ? '+' : ''}${totalProfit?.toLocaleString()} MAD)`,
          type: totalProfit >= 0 ? 'profit' : 'loss'
        };
        setUpdates(prev => [newUpdate, ...prev.slice(0, 9)]); // Keep last 10 updates
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [realTimeUpdates?.enabled, userInvestments, totalCurrent, totalProfit]);

  return (
    <div className="bg-white/5 border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">⚡ Moniteur Temps Réel</h3>
        <button
          onClick={actions.toggleRealTimeUpdates}
          className={`px-4 py-2 rounded-lg text-white transition-colors ${
            realTimeUpdates?.enabled 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {realTimeUpdates?.enabled ? 'Désactiver' : 'Activer'} Temps Réel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Updates Feed */}
        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">📡 Flux de Mises à Jour</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {updates.length > 0 ? updates.map((update, idx) => (
              <div key={idx} className={`p-2 rounded text-sm ${
                update.type === 'profit' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}>
                <div className="flex justify-between">
                  <span>{update.message}</span>
                  <span className="text-xs opacity-70">{update.timestamp}</span>
                </div>
              </div>
            )) : (
              <p className="text-white/50 text-sm">Aucune mise à jour récente...</p>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">⚙️ Paramètres</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">Intervalle de mise à jour</label>
              <select
                value={realTimeUpdates?.updateInterval || 10}
                onChange={(e) => actions.setUpdateInterval(parseInt(e.target.value))}
                className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white"
              >
                <option value={1}>1 minute</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>
            
            <div className="text-sm text-white/70">
              <p>Status: {realTimeUpdates?.enabled ? '🟢 Actif' : '🔴 Inactif'}</p>
              <p>Dernière mise à jour: {realTimeUpdates?.lastUpdate ? 
                new Date(realTimeUpdates.lastUpdate).toLocaleTimeString() : 'Jamais'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics dashboard component
const AnalyticsDashboard = () => {
  const {
    investmentAnalytics,
    financialHealthScore,
    goalProgress,
    topPerformer,
    worstPerformer,
    diversificationScore,
    riskScore
  } = useSharedData();

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/20 rounded-xl p-4">
          <h4 className="text-white/70 text-sm mb-1">Score Santé Financière</h4>
          <div className="text-2xl font-bold text-[#3CD4AB]">{financialHealthScore}%</div>
        </div>
        <div className="bg-white/5 border border-white/20 rounded-xl p-4">
          <h4 className="text-white/70 text-sm mb-1">Diversification</h4>
          <div className="text-2xl font-bold text-blue-400">{diversificationScore?.toFixed(0) || 0}%</div>
        </div>
        <div className="bg-white/5 border border-white/20 rounded-xl p-4">
          <h4 className="text-white/70 text-sm mb-1">Score Risque</h4>
          <div className="text-2xl font-bold text-orange-400">{riskScore?.toFixed(0) || 0}%</div>
        </div>
        <div className="bg-white/5 border border-white/20 rounded-xl p-4">
          <h4 className="text-white/70 text-sm mb-1">ROI Moyen</h4>
          <div className="text-2xl font-bold text-green-400">{investmentAnalytics?.averageROI?.toFixed(1) || 0}%</div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">📈 Analyse de Performance</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {topPerformer && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-medium mb-2">🏆 Meilleure Performance</h4>
              <p className="text-white">{topPerformer.nameProduct}</p>
              <p className="text-green-300">ROI: {topPerformer.roi_product?.toFixed(2)}%</p>
            </div>
          )}
          
          {worstPerformer && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-red-400 font-medium mb-2">📉 À Surveiller</h4>
              <p className="text-white">{worstPerformer.nameProduct}</p>
              <p className="text-red-300">ROI: {worstPerformer.roi_product?.toFixed(2)}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSharingDemo;