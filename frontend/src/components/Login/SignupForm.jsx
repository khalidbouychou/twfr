import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../Context/UserContext';


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
  const navigate = useNavigate();
  const { setIsLoggedIn, updateUserProfile } = useContext(UserContext);

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

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
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
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  try {
                    localStorage.setItem('isLogin', 'true');
                    const cred = credentialResponse.credential || '';
                    localStorage.setItem('googleCredential', cred);
                    const payload = parseJwt(cred);
                    if (payload) {
                      const profile = {
                        name: payload.name,
                        email: payload.email,
                        picture: payload.picture,
                        sub: payload.sub,
                        given_name: payload.given_name,
                        family_name: payload.family_name
                      };
                      localStorage.setItem('googleProfile', JSON.stringify(profile));
                      const unified = {
                        fullName: profile.name,
                        email: profile.email,
                        avatar: profile.picture
                      };
                      localStorage.setItem('userProfileData', JSON.stringify(unified));
                      updateUserProfile(unified);
                    }
                  } catch { /* ignore */ }
                  setIsLoggedIn(true);
                  navigate('/dashboard');
                }}
                onError={() => {
                  // Google Signup Failed - error handled silently
                }}
                theme="filled_black"
                text="signup_with"
                shape="pill"
                size="large"
                logo_alignment="left"
                context="signup"
                use_fedcm_for_prompt={true}
              />
            </div>
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