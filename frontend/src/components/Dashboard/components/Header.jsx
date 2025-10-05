import React, { useState } from 'react';
import { LogOut, UserRoundCog, Wallet, TrendingUp, TrendingDown, Sparkles, ArrowDownToLine } from "lucide-react";
import { useCart } from '../../Context/CartContext';
import { Progress } from '../../ui/progress';

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
  setIsLoggedIn,
  navigate,
  calculateTotalProfits,
  setShowBalanceModal,
  setBalanceOperation,
  setShowProfitModal,
  setProfitOperation,
  setShowSettingsModal,
  setUserBalance,
  setInvestmentHistory,
  addUserInvestment,
  getSectorFromName
}) => {
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const { cartItems, getCartCount, removeFromCart, getTotalAmount, clearCart } = useCart();
  
  // Validation and confirmation states
  const [showInsufficientBalanceAlert, setShowInsufficientBalanceAlert] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  
  // Withdraw balance states
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showWithdrawError, setShowWithdrawError] = useState(false);
  const [withdrawErrorMessage, setWithdrawErrorMessage] = useState('');


  const handleValidateInvestments = () => {
    const totalAmount = getTotalAmount();
    
    // Check if cart is empty
    if (cartItems.length === 0) {
      return;
    }
    
    // Check if user has sufficient balance
    if (totalAmount > userBalance) {
      setShowCartDropdown(false);
      setShowInsufficientBalanceAlert(true);
      setTimeout(() => {
        setShowInsufficientBalanceAlert(false);
      }, 4000);
      return;
    }
    
    // Show processing modal
    setShowCartDropdown(false);
    setProcessingMessage('Vérification de votre demande...');
    setShowProcessingModal(true);
    
    // Simulate processing time
    setTimeout(() => {
      setShowProcessingModal(false);
      setShowConfirmationModal(true);
    }, 2000);
  };

  const handleConfirmInvestment = () => {
    setShowConfirmationModal(false);
    setProcessingMessage('Traitement de vos investissements...');
    setShowProcessingModal(true);
    
    // Simulate investment processing
    setTimeout(() => {
      const totalAmount = getTotalAmount();
      
      // Process each cart item as an investment
      cartItems.forEach((item) => {
        const amount = parseFloat(item.amount);
        const initialProfit = Math.max(1, Math.round(amount * 0.001));
        
        addUserInvestment({
          nameProduct: item.name,
          name: item.name,
          valueInvested: amount,
          amount: amount,
          currentValue: amount + initialProfit,
          profit: initialProfit,
          category: getSectorFromName(item.name),
          sector: getSectorFromName(item.name),
          riskLevel: item.risk || 'moderate',
          roi_product: typeof item.roi === 'object' ? item.roi.annual : (parseFloat(item.roi) || 5),
          picture: item.image,
          image: item.image,
          date: new Date().toISOString()
        });
      });
      
      // Deduct from balance
      setUserBalance(prevBalance => prevBalance - totalAmount);
      
      // Clear cart
      clearCart();
      
      // Show success modal
      setShowProcessingModal(false);
      setShowSuccessModal(true);
      
      // Auto-close success modal after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    }, 2000);
  };

  const handleCancelInvestment = () => {
    setShowConfirmationModal(false);
  };

  // Handle withdraw balance
  const handleWithdrawBalance = () => {
    const amount = parseFloat(withdrawAmount);
    
    // Validation
    if (!withdrawAmount || amount <= 0) {
      setWithdrawErrorMessage('Veuillez entrer un montant valide');
      setShowWithdrawError(true);
      setTimeout(() => setShowWithdrawError(false), 3000);
      return;
    }
    
    if (amount > userBalance) {
      setWithdrawErrorMessage('Solde insuffisant pour ce retrait');
      setShowWithdrawError(true);
      setTimeout(() => setShowWithdrawError(false), 3000);
      return;
    }
    
    // Close modal
    setShowWithdrawModal(false);
    
    // Deduct from balance
    setUserBalance(prevBalance => prevBalance - amount);
    
    // Reset form
    setWithdrawAmount('');
    
    // Show success notification at top (reuse error state with success message)
    setWithdrawErrorMessage(`${amount.toLocaleString()} MAD retirés avec succès`);
    setShowWithdrawError(true);
    setTimeout(() => setShowWithdrawError(false), 3000);
  };

  return (
    <nav className="bg-[#0F0F19] border-b border-white/10 fixed w-full z-30 top-0 start-0">
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 lg:px-5 lg:pl-3">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Top Row - Logo (Centered) */}
          <div className="flex justify-center mb-3">
            <a href='/' className='flex items-center cursor-pointer'>
              <img 
                src="https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706711/tawfir-ai/logo.svg" 
                className="w-8 h-8" 
                alt="TawfirAI Logo" 
              />
            </a>
          </div>

          {/* Second Row - Cart, Notifications, Avatar (Centered) */}
          <div className="flex justify-center items-center gap-4 mb-3">
            {/* Shopping Cart */}
            <div className="relative">
              <button
                onClick={() => setShowCartDropdown(!showCartDropdown)}
                className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Panier d'investissement"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#3CD4AB] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {showCartDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0F0F19] border border-white/20 rounded-lg shadow-lg z-50 max-h-[70vh] overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold">Panier d'investissement</h3>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {cartItems.length === 0 ? (
                      <div className="p-8 text-center text-white/60">
                        <svg className="w-16 h-16 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p>Votre panier est vide</p>
                      </div>
                    ) : (
                      cartItems.map((item, index) => (
                        <div key={index} className="p-4 border-b border-white/10 hover:bg-white/5">
                          <div className="flex items-start gap-3">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-sm truncate">{item.name}</h4>
                              <p className="text-[#3CD4AB] font-semibold text-sm">{(Number(item.amount) || 0).toLocaleString()} MAD</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(item.id);
                              }}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {cartItems.length > 0 && (
                    <div className="p-4 border-t border-white/10 bg-white/5">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-white font-semibold">Total:</span>
                        <span className="text-[#3CD4AB] font-bold text-lg">{getTotalAmount().toLocaleString()} MAD</span>
                      </div>
                      <button 
                        onClick={handleValidateInvestments}
                        className="w-full bg-gradient-to-r from-[#3CD4AB] to-emerald-500 hover:from-[#2bb894] hover:to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                      >
                        Valider les investissements
                      </button>
                    </div>
                  )}
                </div>
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
                <div className="absolute right-0 mt-2 w-80 bg-[#0F0F19] border border-white/20 rounded-lg shadow-lg z-50 max-h-[70vh] overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold">Notifications</h3>
                  </div>
                  <div className="overflow-y-auto flex-1">
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
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=User';
                  }}
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0F0F19] border border-white/20 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowSettingsModal(true);
                        setShowUserMenu(false);
                      }}
                      className="flex items-center gap-2 w-full p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <UserRoundCog size={16} />
                      <span className="text-sm">Paramètres</span>
                    </button>
                    <button
                      onClick={() => {
                        // Clear authentication data
                        localStorage.removeItem('isLogin');
                        localStorage.removeItem('googleProfile');
                        localStorage.removeItem('googleCredential');
                        localStorage.removeItem('userProfileData');
                        
                        // Clear user personal data (name, avatar, etc.)
                        localStorage.removeItem('userContext');
                        localStorage.removeItem('userName');
                        localStorage.removeItem('userAvatar');
                        localStorage.removeItem('userEmail');
                        localStorage.removeItem('fullName');
                        
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

          {/* Third Row - Balance Display and Actions Dropdown */}
          <div className="flex justify-center items-center gap-3">
            {/* Balance Display */}
            <div className="text-white text-sm bg-white/5 px-3 py-2 rounded-lg">
              <span className="text-white/70">Solde: </span>
              <span className="font-bold text-[#3CD4AB]">{(Number(userBalance) || 0).toLocaleString()} MAD</span>
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
                <span className="text-sm font-medium">Gestion</span>
                <svg className={`w-4 h-4 text-orange-400 transition-transform duration-200 ${isActionsDropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>

              {isActionsDropdownOpen && (
                <>
                  <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-[#0F0F19] border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setBalanceOperation("add");
                          setShowBalanceModal(true);
                          setIsActionsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-white hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors duration-200 flex items-center space-x-3"
                      >
                        <Wallet className="w-5 h-5" />
                        <span>Ajouter des Fonds</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowWithdrawModal(true);
                          setIsActionsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-white hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200 flex items-center space-x-3"
                      >
                        <ArrowDownToLine className="w-5 h-5" />
                        <span>Retirer du Solde</span>
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
                            <TrendingDown className="w-5 h-5" />
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
                            <Sparkles className="w-5 h-5" />
                            <span>Ajouter au Solde</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Overlay to close dropdown */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsActionsDropdownOpen(false)}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <a href='/' className='flex items-center cursor-pointer'>
              <img 
                src="https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706711/tawfir-ai/logo.svg" 
                className="w-8 h-8" 
                alt="TawfirAI Logo" 
              />
            </a>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Balance Display */}
            <div className="text-white text-xs sm:text-sm">
              <span className="hidden md:inline">Solde: </span>
              <span className="font-bold text-[#3CD4AB]">{(Number(userBalance) || 0).toLocaleString()}</span>
              <span className="hidden sm:inline"> MAD</span>
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
                <>
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
                        <Wallet className="w-5 h-5" />
                        <span>Ajouter des Fonds</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowWithdrawModal(true);
                          setIsActionsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-white hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200 flex items-center space-x-3"
                      >
                        <ArrowDownToLine className="w-5 h-5" />
                        <span>Retirer du Solde</span>
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
                            <TrendingDown className="w-5 h-5" />
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
                            <Sparkles className="w-5 h-5" />
                            <span>Ajouter au Solde</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Overlay to close dropdown */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsActionsDropdownOpen(false)}
                  />
                </>
              )}
            </div>

            {/* Shopping Cart */}
            <div className="relative">
              <button
                onClick={() => setShowCartDropdown(!showCartDropdown)}
                className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Panier d'investissement"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#3CD4AB] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {showCartDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-[#0F0F19] border border-white/20 rounded-lg shadow-lg z-50 max-h-[500px] overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold">Panier d'investissement</h3>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {cartItems.length === 0 ? (
                      <div className="p-8 text-center text-white/60">
                        <svg className="w-16 h-16 mx-auto mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p>Votre panier est vide</p>
                      </div>
                    ) : (
                      cartItems.map((item, index) => (
                        <div key={index} className="p-4 border-b border-white/10 hover:bg-white/5">
                          <div className="flex items-start gap-3">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-sm truncate">{item.name}</h4>
                              <p className="text-[#3CD4AB] font-semibold text-sm">{(Number(item.amount) || 0).toLocaleString()} MAD</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(item.id);
                              }}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {cartItems.length > 0 && (
                    <div className="p-4 border-t border-white/10 bg-white/5">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-white font-semibold">Total:</span>
                        <span className="text-[#3CD4AB] font-bold text-lg">{getTotalAmount().toLocaleString()} MAD</span>
                      </div>
                      <button 
                        onClick={handleValidateInvestments}
                        className="w-full bg-gradient-to-r from-[#3CD4AB] to-emerald-500 hover:from-[#2bb894] hover:to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                      >
                        Valider les investissements
                      </button>
                    </div>
                  )}
                </div>
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
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=User';
                  }}
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
                    <button
                      onClick={() => {
                        setShowSettingsModal(true);
                        setShowUserMenu(false);
                      }}
                      className="flex items-center gap-2 w-full p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <UserRoundCog size={16} />
                      <span className="text-sm">Paramètres</span>
                    </button>
                    <button
                      onClick={() => {
                        // Clear authentication data
                        localStorage.removeItem('isLogin');
                        localStorage.removeItem('googleProfile');
                        localStorage.removeItem('googleCredential');
                        localStorage.removeItem('userProfileData');
                        
                        // Clear user personal data (name, avatar, etc.)
                        localStorage.removeItem('userContext');
                        localStorage.removeItem('userName');
                        localStorage.removeItem('userAvatar');
                        localStorage.removeItem('userEmail');
                        localStorage.removeItem('fullName');
                        
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

      {/* Insufficient Balance Alert */}
      {showInsufficientBalanceAlert && (
        <div className="fixed top-20 right-4 z-[60] animate-fade-in">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 border border-red-400/20">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Solde insuffisant!</p>
              <p className="text-sm text-white/90">Solde: {(Number(userBalance) || 0).toLocaleString()} MAD | Besoin: {(Number(getTotalAmount()) || 0).toLocaleString()} MAD</p>
            </div>
          </div>
        </div>
      )}

      {/* Processing Modal */}
      {showProcessingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-[#3CD4AB] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg font-semibold">{processingMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-6 max-w-2xl w-full border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-7 h-7 text-[#3CD4AB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Confirmation d'investissement
            </h3>
            
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Date:</span>
                <span className="text-white font-semibold">{new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Heure:</span>
                <span className="text-white font-semibold">{new Date().toLocaleTimeString('fr-FR')}</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-white font-semibold mb-3">Détails des investissements:</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 flex items-start gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h5 className="text-white font-medium mb-1">{item.name}</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-white/60">Montant:</span>
                          <p className="text-[#3CD4AB] font-semibold">{(Number(item.amount) || 0).toLocaleString()} MAD</p>
                        </div>
                        <div>
                          <span className="text-white/60">Risque:</span>
                          <p className="text-white font-semibold">{item.risk}/10</p>
                        </div>
                        <div>
                          <span className="text-white/60">ROI Annuel:</span>
                          <p className="text-emerald-400 font-semibold">{item.roi?.annual || 5}%</p>
                        </div>
                        <div>
                          <span className="text-white/60">Liquidité:</span>
                          <p className="text-white font-semibold text-xs">{item.roi?.liquidity || 'Standard'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#3CD4AB]/20 to-emerald-500/20 border border-[#3CD4AB]/30 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">Montant total:</span>
                <span className="text-[#3CD4AB] font-bold text-2xl">{(Number(getTotalAmount()) || 0).toLocaleString()} MAD</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Solde actuel:</span>
                <span className="text-white font-semibold">{(Number(userBalance) || 0).toLocaleString()} MAD</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1 pt-2 border-t border-white/10">
                <span className="text-white/70">Nouveau solde:</span>
                <span className="text-emerald-400 font-bold">{((Number(userBalance) || 0) - (Number(getTotalAmount()) || 0)).toLocaleString()} MAD</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelInvestment}
                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmInvestment}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#3CD4AB] to-emerald-500 hover:from-[#2bb894] hover:to-emerald-600 text-white font-semibold rounded-lg transition-all shadow-lg"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Investissement réussi!</h3>
              <p className="text-white/70 mb-4">Vos investissements ont été traités avec succès</p>
              <div className="bg-white/5 rounded-lg p-4 w-full">
                <p className="text-white/60 text-sm mb-1">Nouveau solde:</p>
                <p className="text-[#3CD4AB] font-bold text-2xl">{(Number(userBalance) || 0).toLocaleString()} MAD</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Balance Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-[#1a1a2e] rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <ArrowDownToLine className="w-6 h-6 text-red-400" />
                Retirer du Solde
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <p className="text-white/60 text-sm mb-1">Solde disponible:</p>
              <p className="text-[#3CD4AB] font-bold text-2xl">{(Number(userBalance) || 0).toLocaleString()} MAD</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Montant à retirer
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-red-400 focus:outline-none transition-colors pr-16"
                  min="0"
                  step="0.01"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60">MAD</span>
              </div>
            </div>

            {withdrawAmount && parseFloat(withdrawAmount) > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/70">Nouveau solde:</span>
                  <span className="text-white font-bold">
                    {((Number(userBalance) || 0) - (Number(withdrawAmount) || 0)).toLocaleString()} MAD
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount('');
                }}
                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleWithdrawBalance}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all shadow-lg"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Notification Toast (Success/Error) */}
      {showWithdrawError && (
        <div className="fixed top-4 right-4 z-[70] animate-fade-in">
          <div className={`${withdrawErrorMessage.includes('succès') ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 border ${withdrawErrorMessage.includes('succès') ? 'border-green-400/20' : 'border-red-400/20'}`}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              {withdrawErrorMessage.includes('succès') ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              )}
            </svg>
            <div>
              <p className="font-semibold">{withdrawErrorMessage.includes('succès') ? 'Succès!' : 'Erreur!'}</p>
              <p className="text-sm text-white/90">{withdrawErrorMessage}</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
