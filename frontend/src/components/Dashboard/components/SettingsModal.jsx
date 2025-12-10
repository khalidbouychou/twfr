import React, { useEffect, useState } from 'react';

const SettingsModal = ({ 
  showSettingsModal,
  setShowSettingsModal,
  userData,
  fallbackAvatar,
  setIsLoggedIn,
  navigate
}) => {
  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' | 'error' | 'info'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form data when modal opens or userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        avatar: userData.avatar || ''
      });
      setAvatarPreview(userData.avatar || fallbackAvatar);
      
      // Check if 2FA is enabled from localStorage
      const twoFAStatus = localStorage.getItem('twoFactorEnabled') === 'true';
      setTwoFactorEnabled(twoFAStatus);
    }
  }, [userData, fallbackAvatar]);

  // Show toast notification
  const showNotification = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showSettingsModal) {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          setShowSettingsModal(false);
        }
      }
    };

    if (showSettingsModal) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showSettingsModal, setShowSettingsModal, showDeleteConfirm]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle avatar URL change
  const handleAvatarChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      avatar: url
    }));
    setAvatarPreview(url || fallbackAvatar);
  };

  // Handle avatar file upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showNotification('L\'image ne doit pas dépasser 2 MB', 'error');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        showNotification('Veuillez sélectionner une image valide', 'error');
        return;
      }

      setIsUploading(true);
      
      // Create image element to compress
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (event) => {
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions (max 400x400 for profile pictures)
          let width = img.width;
          let height = img.height;
          const maxSize = 400;
          
          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression (0.8 quality for JPEG)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          
          // Check compressed size
          const sizeInBytes = (compressedBase64.length * 3) / 4;
          const sizeInKB = sizeInBytes / 1024;
          
          if (sizeInKB > 500) {
            setIsUploading(false);
            showNotification('L\'image compressée est toujours trop grande. Essayez une image plus petite.', 'error');
            return;
          }
          
          setFormData(prev => ({
            ...prev,
            avatar: compressedBase64
          }));
          setAvatarPreview(compressedBase64);
          setIsUploading(false);
          showNotification(`Image chargée avec succès (${Math.round(sizeInKB)} KB)`, 'success');
        };
        
        img.onerror = () => {
          setIsUploading(false);
          showNotification('Erreur lors du chargement de l\'image', 'error');
        };
        
        img.src = event.target.result;
      };
      
      reader.onerror = () => {
        setIsUploading(false);
        showNotification('Erreur lors de la lecture du fichier', 'error');
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSaveProfile = () => {
    try {
      // Validate inputs
      if (!formData.name || formData.name.trim() === '') {
        showNotification('Le nom ne peut pas être vide', 'error');
        return;
      }

      // Check if avatar is base64 and too large (> 500KB for safety)
      let avatarToSave = formData.avatar;
      if (formData.avatar && formData.avatar.startsWith('data:image/')) {
        const base64Length = formData.avatar.length;
        const sizeInBytes = (base64Length * 3) / 4;
        const sizeInKB = sizeInBytes / 1024;
        
        if (sizeInKB > 500) {
          showNotification('L\'image est trop volumineuse. Veuillez utiliser une image plus petite (< 500 KB)', 'error');
          return;
        }
      }

      // Update userProfileData in localStorage
      const currentProfile = JSON.parse(localStorage.getItem('userProfileData') || '{}');
      const updatedProfile = {
        ...currentProfile,
        name: formData.name.trim(),
        fullName: formData.name.trim(),
        avatar: avatarToSave || currentProfile.avatar,
        picture: avatarToSave || currentProfile.picture,
        imageUrl: avatarToSave || currentProfile.imageUrl
      };

      try {
        localStorage.setItem('userProfileData', JSON.stringify(updatedProfile));
      } catch (storageError) {
        if (storageError.name === 'QuotaExceededError') {
          showNotification('Espace de stockage insuffisant. L\'image est trop grande.', 'error');
          return;
        }
        throw storageError;
      }

      // Update userContext in localStorage for unified state management
      try {
        const userContext = JSON.parse(localStorage.getItem('userContext') || '{}');
        if (Object.keys(userContext).length > 0) {
          userContext.fullname = formData.name.trim();
          userContext.avatar = avatarToSave || userContext.avatar;
          localStorage.setItem('userContext', JSON.stringify(userContext));
        }
      } catch (e) {
        console.error('Error updating userContext:', e);
        // Don't fail the whole operation if this fails
      }

      // Also update Google profile if exists
      try {
        const googleProfile = JSON.parse(localStorage.getItem('googleProfile') || '{}');
        if (Object.keys(googleProfile).length > 0) {
          googleProfile.name = formData.name.trim();
          if (avatarToSave) {
            googleProfile.picture = avatarToSave;
          }
          localStorage.setItem('googleProfile', JSON.stringify(googleProfile));
        }
      } catch (e) {
        console.error('Error updating Google profile:', e);
        // Don't fail the whole operation if this fails
      }

      // Show success message
      showNotification('Profil mis à jour avec succès!', 'success');
      setIsEditing(false);

      // Trigger a custom event to notify other components
      window.dispatchEvent(new Event('userProfileUpdated'));

    } catch (error) {
      console.error('Error saving profile:', error);
      showNotification('Erreur lors de la mise à jour du profil', 'error');
    }
  };

  // Toggle 2FA
  const handleToggle2FA = () => {
    const newStatus = !twoFactorEnabled;
    setTwoFactorEnabled(newStatus);
    localStorage.setItem('twoFactorEnabled', newStatus.toString());
    
    if (newStatus) {
      showNotification('Authentification à deux facteurs activée', 'success');
    } else {
      showNotification('Authentification à deux facteurs désactivée', 'info');
    }
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    if (deleteConfirmText.toLowerCase() === 'supprimer') {
      try {
        // Clear all localStorage data
        localStorage.clear();
        
        // Show success message
        showNotification('Compte supprimé avec succès', 'success');
        
        // Update login state
        setIsLoggedIn(false);
        
        // Close modals
        setShowDeleteConfirm(false);
        setShowSettingsModal(false);
        
        // Redirect to home after a short delay
        setTimeout(() => {
          if (navigate) {
            navigate('/');
          }
        }, 1500);
        
      } catch (error) {
        console.error('Error deleting account:', error);
        showNotification('Erreur lors de la suppression du compte', 'error');
      }
    } else {
      showNotification('Veuillez taper "supprimer" pour confirmer', 'error');
    }
  };

  if (!showSettingsModal) {
    return null;
  }

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[60] animate-fade-in">
          <div className={`px-6 py-4 rounded-lg shadow-lg border ${
            toastType === 'success' ? 'bg-green-500 border-green-600 text-white' :
            toastType === 'error' ? 'bg-red-500 border-red-600 text-white' :
            'bg-blue-500 border-blue-600 text-white'
          }`}>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Settings Modal */}
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => !isEditing && setShowSettingsModal(false)}
      >
        <div 
          className="bg-[#0F0F19] border border-white/20 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#0F0F19] border-b border-white/10 p-6 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Paramètres du compte
            </h3>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Profile Section */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Informations du profil</h4>
                  <p className="text-sm text-white/60">Gérez vos informations personnelles</p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#3CD4AB] hover:bg-[#2bb894] text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: userData.name || '',
                          email: userData.email || '',
                          avatar: userData.avatar || ''
                        });
                        setAvatarPreview(userData.avatar || fallbackAvatar);
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-[#3CD4AB] hover:bg-[#2bb894] text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              {/* Avatar Section */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white/10"
                    onError={(e) => {
                      e.target.src = fallbackAvatar;
                    }}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Télécharger une image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="block w-full text-sm text-white/60
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-lg file:border-0
                            file:text-sm file:font-medium
                            file:bg-[#3CD4AB] file:text-white
                            hover:file:bg-[#2bb894]
                            file:cursor-pointer cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          Ou entrer une URL
                        </label>
                        <input
                          type="url"
                          value={formData.avatar}
                          onChange={handleAvatarChange}
                          placeholder="https://exemple.com/avatar.jpg"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none transition-colors"
                        />
                      </div>
                      <p className="text-xs text-white/50">Max 2 MB • JPG, PNG, GIF</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white font-medium mb-1">{userData?.name}</p>
                      <p className="text-white/60 text-sm">{userData?.email}</p>
                      <p className="text-white/40 text-xs mt-1">
                        Membre depuis {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('fr-FR') : 'récemment'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              {isEditing && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                      Adresse email
                      <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded">Non modifiable</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      readOnly
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/50 cursor-not-allowed"
                    />
                    <p className="text-xs text-white/40 mt-1">
                      L'adresse email ne peut pas être modifiée pour des raisons de sécurité
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Security Section */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Sécurité</h4>
              
              {/* 2FA Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Authentification à deux facteurs</p>
                    <p className="text-white/60 text-sm">Ajoutez une couche de sécurité supplémentaire</p>
                  </div>
                </div>
                <button
                  onClick={handleToggle2FA}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    twoFactorEnabled ? 'bg-[#3CD4AB]' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/30">
              <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Zone dangereuse
              </h4>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer mon compte
                </button>
                
                <p className="text-red-300/60 text-xs text-center">
                  ⚠️ Cette action est irréversible et supprimera toutes vos données
                </p>
              </div>
            </div>

            {/* Help Text */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-sm text-center">
                💡 Appuyez sur Échap pour fermer cette fenêtre
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div 
            className="bg-[#0F0F19] border border-red-500/50 rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Supprimer votre compte ?</h3>
              <p className="text-white/60 text-sm mb-4">
                Cette action est <span className="text-red-400 font-semibold">permanente et irréversible</span>.
                Toutes vos données seront définitivement supprimées.
              </p>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                <p className="text-red-300 text-sm font-medium">
                  ⚠️ Vous perdrez :
                </p>
                <ul className="text-red-200/80 text-xs text-left mt-2 space-y-1 ml-4">
                  <li>• Tous vos investissements</li>
                  <li>• Votre historique de transactions</li>
                  <li>• Vos simulations et profils</li>
                  <li>• Vos paramètres personnalisés</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Tapez <span className="text-red-400 font-semibold">supprimer</span> pour confirmer
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="supprimer"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-red-500 focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText.toLowerCase() !== 'supprimer'}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsModal;
