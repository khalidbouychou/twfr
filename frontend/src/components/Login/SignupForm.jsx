import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';


const SignupForm = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Inscription:', formData);
  };

  return (
    <div className="w-full max-w-md ">
      {/* Card Container */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3CD4AB] to-[#3CD4AB]/80 px-4 py-4 rounded-t-2xl text-center">
          <h1 className="text-xl font-bold text-white">
            Créer un Compte
          </h1>
          <p className="text-white/90 mt-2">
          Créez un compte pour accéder à votre espace personnel
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-4 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Firstname lastname Fields */}
              <div className="space-y-1">
                <Label htmlFor="lastName" className="text-gray-300 text-sm">
                  Nom et Prénom
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Nom et Prénom"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#3CD4AB] h-9"
                    required
                  />
                </div>
              </div>
            

            {/* Phone Field */}
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-gray-300 text-sm">
                Numéro de Téléphone
              </Label>
            
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+212 6 00 00 00 00"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#3CD4AB] h-9"
                  required
                />
              </div>
            </div>


            {/* Email Field */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-gray-300 text-sm">
                Adresse Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@exemple.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#3CD4AB] h-9"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-gray-300 text-sm">
                Mot de Passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Entrez votre mot de passe"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#3CD4AB] h-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#3CD4AB]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-gray-300 text-sm">
                Confirmer le Mot de Passe
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#3CD4AB] h-9"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className= " cursor-pointer w-full bg-gradient-to-r from-[#3CD4AB] to-[#3CD4AB]/80 hover:from-[#3CD4AB]/90 hover:to-[#3CD4AB] text-white font-semibold py-2 rounded-lg transition-all duration-200 transform hover:scale-[1.02] mt-4"
            >
              Créer un Compte
            </Button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-sm text-gray-400">ou</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full border-white/20 hover:bg-white/5 text-white py-2 cursor-pointer"
              onClick={() => console.log('Google signup')}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuer avec Google
            </Button>
          </div>

          {/* Toggle Mode */}
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              Vous avez déjà un compte ?
              <button
                onClick={onSwitchToLogin}
                className="cursor-pointer ml-1 text-[#3CD4AB] hover:text-[#3CD4AB]/80 font-medium transition-colors"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm; 