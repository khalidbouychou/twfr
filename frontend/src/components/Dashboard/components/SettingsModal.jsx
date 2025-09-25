import React from 'react';

const SettingsModal = ({ 
  showSettingsModal,
  setShowSettingsModal,
  userData,
  fallbackAvatar,
  setIsLoggedIn,
  navigate
}) => {
  if (!showSettingsModal) {
    return null;
  }

  const handleResetAllData = () => {
    if (window.confirm("⚠️ Êtes-vous sûr de vouloir réinitialiser toutes vos données ? Cette action est irréversible.")) {
      // Clear all localStorage data
      const keysToKeep = ['userProfileData', 'isLoggedIn'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      
      // Reset specific data
      localStorage.removeItem('userBalance');
      localStorage.removeItem('investmentHistory');
      localStorage.removeItem('transactionsHistory');
      localStorage.removeItem('portfolioData');
      localStorage.removeItem('notificationHistory');
      localStorage.removeItem('recentSimulations');
      
      // Reload the page to reset state
      window.location.reload();
    }
  };

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      localStorage.clear();
      setIsLoggedIn(false);
      if (navigate) {
        navigate('/');
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0F0F19] border border-white/20 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Paramètres</h3>
          <button
            onClick={() => setShowSettingsModal(false)}
            className="text-white/60 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* User Profile Section */}
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={userData?.avatar || fallbackAvatar}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = fallbackAvatar;
                }}
              />
              <div>
                <h4 className="text-white font-semibold">
                  {userData?.name || "Utilisateur"}
                </h4>
                <p className="text-white/60 text-sm">
                  {userData?.email}
                </p>
                <p className="text-white/40 text-xs">
                  Membre depuis{" "}
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString("fr-FR")
                    : "récemment"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleResetAllData}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              🔄 Réinitialiser toutes les données
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              🚪 Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;