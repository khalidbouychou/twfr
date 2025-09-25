import React, { useState } from 'react';
import { LogOut, UserRoundCog } from "lucide-react";

const Header = ({ 
  userData, 
  userBalance, 
  showUserMenu, 
  setShowUserMenu, 
  showNotifications, 
  setShowNotifications, 
  notifications, 
  handleNotificationClick, 
  getNotificationIcon, 
  setSidebarOpen,
  setIsLoggedIn,
  navigate,
  portfolioData,
  calculateTotalProfits,
  setShowBalanceModal,
  setBalanceOperation,
  setShowProfitModal,
  setProfitOperation
}) => {
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  return (
    <nav className="bg-[#0F0F19] border-b border-white/10 fixed w-full z-30 top-0 start-0">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="inline-flex items-center p-2 text-sm text-white rounded-lg md:hidden hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-white text-sm">
              Solde: <span className="font-bold text-[#3CD4AB]">{userBalance.toLocaleString()} MAD</span>
            </div>

            {/* Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30"
              >
                <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
                <span className="hidden md:block text-sm font-medium">Gestion des Fonds</span>
                <svg className={`w-4 h-4 text-orange-400 transition-transform duration-200 ${isActionsDropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>

              {isActionsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0F0F19] border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setBalanceOperation("add");
                        setShowBalanceModal(true);
                        setIsActionsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-white hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors duration-200 flex items-center space-x-3"
                    >
                      <span>💰</span>
                      <span>Ajouter des Fonds</span>
                    </button>
                    
                    {calculateTotalProfits() > 0 && (
                      <>
                        <button
                          onClick={() => {
                            setProfitOperation("withdraw");
                            setShowProfitModal(true);
                            setIsActionsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-white hover:bg-purple-500/20 hover:text-purple-300 transition-colors duration-200 flex items-center space-x-3"
                        >
                          <span>🎯</span>
                          <span>Retirer les Profits</span>
                        </button>
                        <button
                          onClick={() => {
                            setProfitOperation("add");
                            setShowProfitModal(true);
                            setIsActionsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-white hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors duration-200 flex items-center space-x-3"
                        >
                          <span>✨</span>
                          <span>Ajouter au Solde</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Overlay to close dropdown when clicking outside */}
              {isActionsDropdownOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsActionsDropdownOpen(false)}
                />
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#0F0F19] border border-white/20 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-white/60 text-center">
                        Aucune notification
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 border-b border-white/10 cursor-pointer hover:bg-white/5 transition-colors ${
                            !notification.isRead ? 'bg-[#3CD4AB]/10' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-[#3CD4AB] mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <p className="text-white text-sm font-medium mb-1">
                                {notification.title}
                              </p>
                              <p className="text-white/70 text-xs">
                                {notification.message}
                              </p>
                              <p className="text-white/50 text-xs mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-[#3CD4AB] rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:block text-sm">{userData.name}</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0F0F19] border border-white/20 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <button className="flex items-center gap-2 w-full p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                      <UserRoundCog size={16} />
                      <span className="text-sm">Paramètres</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        navigate("/");
                      }}
                      className="flex items-center gap-2 w-full p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <LogOut size={16} />
                      <span className="text-sm">Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;