import React, { useState } from 'react';
import { useUserContext } from '../Context/UserContext';
import { Link } from 'react-router-dom';

const UserNavigation = () => {
  const { isProfileComplete, userProfileData, userResults } = useUserContext();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Mock user data - in a real app this would come from authentication
  const user = {
    name: userProfileData?.gender === 'Mr' ? 'Khalid Bouychou' : 'khalid Bouychou',
    email: userProfileData?.gender === 'Mr' ? 'Khalid@tawfir.com' : 'khalid @tawfir.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  return (
    <div className="bg-white/10 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-white font-bold text-xl">
              <img src="/logo.svg" alt="Tawfir" className="w-10 h-10" />
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link 
                to="/simulation" 
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  window.location.pathname === '/simulation'
                    ? 'bg-[#3CD4AB] text-[#0F0F19] font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Profil Financier
              </Link>
              
              {isProfileComplete && (
                <Link 
                  to="/dashboard" 
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    window.location.pathname === '/dashboard'
                      ? 'bg-[#3CD4AB] text-[#0F0F19] font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Tableau de Bord
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isProfileComplete && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#3CD4AB] rounded-full"></div>
                <span className="text-[#3CD4AB] text-sm font-medium">
                  Profil complété
                </span>
              </div>
            )}
            
            {userResults && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#89559F] rounded-full"></div>
                <span className="text-[#89559F] text-sm font-medium">
                  Recommandations disponibles
                </span>
              </div>
            )}

            {/* User Avatar and Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-[#3CD4AB]"
                />
                <div className="text-left">
                  <div className="text-white font-medium text-sm">{user.name}</div>
                  <div className="text-gray-400 text-xs">{user.email}</div>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0F0F19] border border-white/20 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-[#3CD4AB]"
                      />
                      <div>
                        <div className="text-white font-semibold">{user.name}</div>
                        <div className="text-gray-400 text-sm">{user.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Paramètres</span>
                    </button>
                    
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Mon Profil</span>
                    </button>
                    
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Aide</span>
                    </button>
                    
                    <div className="border-t border-white/10 my-2"></div>
                    
                    <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0F0F19] rounded-lg p-6 max-w-md w-full mx-4 border border-[#89559F]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Paramètres</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Notifications
                </label>
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="accent-[#3CD4AB]" defaultChecked />
                  <span className="text-gray-300">Activer les notifications</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Thème
                </label>
                <select className="w-full p-3 border border-[#89559F] rounded-lg bg-[#0F0F19] text-white">
                  <option value="dark">Sombre</option>
                  <option value="light">Clair</option>
                  <option value="auto">Automatique</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Langue
                </label>
                <select className="w-full p-3 border border-[#89559F] rounded-lg bg-[#0F0F19] text-white">
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-[#3CD4AB] text-[#0F0F19] rounded-lg hover:bg-[#2bb894] transition-all duration-200 font-semibold"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNavigation; 