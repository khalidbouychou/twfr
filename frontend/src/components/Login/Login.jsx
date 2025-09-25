import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  

  const handleSwitchToSignup = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-[#0F0F19] flex overflow-hidden">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/1 overflow-hidden">
        <img src="https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706704/tawfir-ai/bg-login.jpg" alt="login" className="w-full h-[100vh] object-cover" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center ">
        {isLogin ? (
          <LoginForm onSwitchToSignup={handleSwitchToSignup} />
        ) : (
          <SignupForm onSwitchToLogin={handleSwitchToLogin} />
        )}
      </div>

    </div>
  );
};

export default Login;

