import React, { useState , useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { UserContext } from '../Context/UserContext';
import { GoogleLogin } from '@react-oauth/google';


const LoginForm = ({ onSwitchToSignup }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setIsLoggedIn, updateUserProfile } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    console.log('Connexion:', formData);
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
    <div className="w-full max-w-md max-h-screen">
      {/* Card Container */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden ">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3CD4AB] to-[#3CD4AB]/80 px-4 py-4 text-center">
          <h1 className="text-2xl font-bold text-white">
          Bienvenue
          </h1>
          <p className="text-white/90 mt-2">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Form */}
        <div className="px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
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
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#3CD4AB]"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
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
                  className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-[#3CD4AB]"
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

            {/* Submit Button */}
            <Button
              onClick={(e) => {
                e.preventDefault();
                localStorage.setItem('isLogin', 'true');
                setIsLoggedIn(true);
                navigate('/dashboard');
              }}
            
              type="submit"
              className="w-full bg-gradient-to-r from-[#3CD4AB] to-[#3CD4AB]/80 hover:from-[#3CD4AB]/90 hover:to-[#3CD4AB] text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Se Connecter
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-sm text-gray-400">ou</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
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
                  console.log('Google Login Failed');
                }}
                theme="filled_black"
                padding= "10px"
                text="signin_with"
                shape="pill"
                size="large"
                logo_alignment="left"
                context="signin"
              />
            </div>
          </div>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Vous n'avez pas de compte ?
              <button
                onClick={onSwitchToSignup}
                className="ml-1 text-[#3CD4AB] hover:text-[#3CD4AB]/80 font-medium transition-colors"
              >
                S'inscrire
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <div className="mt-6 text-center text-sm text-gray-500">
        <p>En continuant, vous acceptez nos Conditions d'Utilisation et Politique de Confidentialité</p>
      </div> */}
    </div>
  );
};

export default LoginForm; 