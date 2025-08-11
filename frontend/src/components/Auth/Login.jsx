import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const success = await login(email);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Email non trouvé. Veuillez créer un compte.');
      }
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
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
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