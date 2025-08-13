import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await login(email);
      if (result.success) {
        // Redirect to the page they were trying to access, or dashboard
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Email non trouvé. Veuillez créer un compte.');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F19] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 border border-[#89559F]/30 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full bg-white/10 border border-[#89559F]/30 rounded-lg px-4 py-3 text-white focus:border-[#3CD4AB] outline-none" 
              placeholder="votre@email.com"
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/30 rounded-lg p-3">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#3CD4AB] text-[#0F0F19] font-medium py-3 rounded-lg hover:bg-[#3CD4AB]/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <p className="text-center text-white/60 text-sm mt-4">
          Pas de compte ? <Link to="/signup" className="text-[#3CD4AB] hover:text-[#89559F]">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 