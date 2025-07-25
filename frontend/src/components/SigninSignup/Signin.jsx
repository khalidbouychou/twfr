import React, { useState } from 'react';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignin = (e) => {
    e.preventDefault();
    // Handle sign-in logic here
    console.log('Sign in with:', { email, password });
  };

  const handleGoogleSignin = () => {
    // Handle Google sign-in logic here
    console.log('Sign in with Google');
  };

  return (

    <div className='flex flex-col md:flex-row justify-center items-center h-screen'>
            <div className='w-full h-full md:w-1/2 relative'>
                {/* <Signup /> */}
                <img src="../../../public/signin.jpg" alt="TawfirAI Logo" className='w-full h-full' />
            </div>
            <div className='w-full md:w-1/2' >
                {/* <Signin /> */}
                <div className="flex items-center justify-center min-h-screen bg-bg-dark">
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#181828]/90 rounded-lg shadow-lg p-8 mx-auto max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Connexion</h2>
        <form onSubmit={handleSignin} className="w-full flex flex-col gap-4">
            <>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Entrez votre email"
                  className="w-full px-3 py-2 border border-gray-600 bg-transparent text-white rounded focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Entrez votre mot de passe"
                  className="w-full px-3 py-2 border border-gray-600 bg-transparent text-white rounded focus:outline-none focus:ring-2 focus:ring-accent placeholder-gray-400"
                />
                <div className="flex items-center justify-between mt-2">
                  <label className="flex items-center text-sm text-white">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe((prev) => !prev)}
                      className="form-checkbox h-4 w-4 text-accent bg-gray-800 border-gray-600 rounded mr-2"
                    />
                    Se souvenir de moi
                  </label>
                  <a href="#" className="text-[#3CD4AB] hover:underline text-sm font-semibold">Mot de passe oublié&nbsp;?</a>
                </div>
              </div>
            </>
          <button
            type="submit"
            className="w-full bg-[#89559F] text-white py-2 rounded font-semibold hover:bg-purple-700 transition-colors"
          >
            Se connecter
          </button>
          <div className="flex items-center my-4 w-full">
            <hr className="flex-grow border-t border-gray-600" />
            <span className="mx-2 text-gray-400 font-semibold">ou</span>
            <hr className="flex-grow border-t border-gray-600" />
          </div>
        </form>
        <div className="flex flex-col gap-2 mt-4 w-full">
          <button
            onClick={handleGoogleSignin}
            className="w-full flex items-center justify-center gap-2 border border-gray-600 text-white py-2 rounded hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.13 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.98 6.2C12.13 13.13 17.57 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29c-1.13-3.36-1.13-6.97 0-10.33l-7.98-6.2C.99 16.09 0 19.91 0 24c0 4.09.99 7.91 2.69 12.24l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.13 0 11.64-2.03 15.84-5.53l-7.19-5.59c-2.01 1.35-4.59 2.13-8.65 2.13-6.43 0-11.87-3.63-14.33-8.89l-7.98 6.2C6.73 42.2 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            Se connecter avec Google
          </button>
        </div>
        <div className="mt-6 text-center">
          <span className="text-white">Vous n'avez pas de compte ? </span>
          <a href="/signup" className="text-[#3CD4AB] hover:underline font-semibold">Inscrivez-vous</a>
        </div>
      </div>
    </div>
            </div>
        </div>
    
  );
};

export default Signin;
