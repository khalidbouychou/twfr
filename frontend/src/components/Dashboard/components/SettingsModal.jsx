import React, { useEffect } from 'react';

const SettingsModal = ({ 
  showSettingsModal,
  setShowSettingsModal,
  userData,
  fallbackAvatar,
  setIsLoggedIn,
  navigate
}) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showSettingsModal) {
        setShowSettingsModal(false);
      }
    };

    if (showSettingsModal) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showSettingsModal, setShowSettingsModal]);

  if (!showSettingsModal) {
    return null;
  }

  const handleResetAllData = () => {
    if (window.confirm("⚠️ Êtes-vous sûr de vouloir réinitialiser toutes vos données ? Cette action est irréversible.")) {
      try {
        // Get all localStorage keys
        const allKeys = Object.keys(localStorage);
        
        // Keys to preserve (user login and profile data)
        const keysToKeep = ['userProfileData', 'isLoggedIn'];
        
        // Remove all data except essential login info
        allKeys.forEach(key => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        });
        
        // Reset the initialization flag so user gets welcome bonus again
        localStorage.removeItem('userInitialized');
        
        // Show success message
        alert("✅ Toutes les données ont été réinitialisées avec succès!");
        
        // Close the modal
        setShowSettingsModal(false);
        
        // Reload the page to reset state
        setTimeout(() => {
          window.location.reload();
        }, 500);
        
      } catch (error) {
        console.error("Error resetting data:", error);
        alert("❌ Erreur lors de la réinitialisation des données. Veuillez essayer de nouveau.");
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      try {
        // Clear all localStorage data
        localStorage.clear();
        
        // Update login state
        setIsLoggedIn(false);
        
        // Close the modal
        setShowSettingsModal(false);
        
        // Navigate to home page
        if (navigate) {
          navigate('/');
        } else {
          window.location.href = '/';
        }
        
      } catch (error) {
        console.error("Error during logout:", error);
        // Fallback: force redirect
        window.location.href = '/';
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={() => setShowSettingsModal(false)}
    >
      <div 
        className="bg-[#0F0F19] border border-white/20 rounded-lg p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
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
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              🔄 Réinitialiser toutes les données
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              🚪 Se déconnecter
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-300 text-xs text-center">
              💡 Conseil: Utilisez la touche Échap pour fermer cette fenêtre
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;