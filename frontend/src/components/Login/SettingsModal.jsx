import React, { useState, useContext, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { X, RefreshCw } from 'lucide-react';
import { AuthContext } from '../Context/AuthContext.jsx';

const SettingsModal = ({ isOpen, onClose }) => {
  const { currentUser, updateUser, generateRandomAvatar } = useContext(AuthContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser, isOpen]);

  const handleSave = () => {
    if (!fullName.trim()) {
      alert('Le nom complet est obligatoire');
      return;
    }

    updateUser({
      fullName,
      phone,
      avatar
    });

    setSuccessMessage('Paramètres enregistrés avec succès!');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1500);
  };

  const handleGenerateNewAvatar = () => {
    const newAvatar = generateRandomAvatar();
    setAvatar(newAvatar);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0F0F19] border border-white/20 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Paramètres du compte</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Success Message */}
          {successMessage && (
            <div className="p-3 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 text-sm">
              {successMessage}
            </div>
          )}

          {/* Avatar Section */}
          <div className="space-y-3">
            <Label className="text-white/80">Photo de profil</Label>
            <div className="flex items-center gap-4">
              <img
                src={avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border border-white/20"
              />
              <button
                onClick={handleGenerateNewAvatar}
                className="flex items-center gap-2 px-3 py-2 bg-[#3CD4AB]/20 text-[#3CD4AB] rounded-lg hover:bg-[#3CD4AB]/30 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Générer</span>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label className="text-white/80">Nom complet</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Votre nom"
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#3CD4AB]"
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label className="text-white/80">Email</Label>
            <div className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white/60">
              {email}
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="text-white/80">Téléphone</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+212 6 00 00 00 00"
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#3CD4AB]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-[#3CD4AB] hover:bg-[#3CD4AB]/90 text-white font-semibold rounded-lg py-2"
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
