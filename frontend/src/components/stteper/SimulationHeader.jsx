import React, { useState } from 'react';

const SimulationHeader = ({ showBackButton = true, onBackClick, showHelp = true }) => {
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);

  const toggleHelpDropdown = () => {
    setShowHelpDropdown(!showHelpDropdown);
  };

  return (
    <div className="shadow-sm border-b" style={{ backgroundColor: '#0F0F19', borderColor: '#89559F' }}>
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center text-white cursor-pointer hover:text-gray-300 transition-colors">
          {showBackButton && (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              {onBackClick ? (
                <span className="font-medium" onClick={onBackClick}>Retour</span>
              ) : (
                <a href="/"><span className="font-medium">Retour</span></a>
              )}
            </>
          )}
        </div>
        
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3CD4AB' }}>
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold text-white ml-2">Tawfir</span>
        </div>
        
        {showHelp && (
          <div className="relative">
            <div className="flex items-center text-white cursor-pointer hover:text-gray-300 transition-colors" onClick={toggleHelpDropdown}>
              <span className="font-medium mr-2">Aide</span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3CD4AB' }}>
                <span className="text-white text-sm font-bold">?</span>
              </div>
            </div>
            
            {/* Help Dropdown */}
            {showHelpDropdown && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg border z-50" style={{ backgroundColor: '#0F0F19', borderColor: '#89559F' }}>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Support Services
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Email Support */}
                    <div className="flex items-center p-3 rounded-lg border" style={{ backgroundColor: 'rgba(137, 85, 159, 0.1)', borderColor: '#89559F' }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#3CD4AB' }}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">Email Support</p>
                        <a href="mailto:support@tawfir.com" className="text-white font-medium hover:text-gray-300 transition-colors">
                          support@tawfir.com
                        </a>
                      </div>
                    </div>
                    
                    {/* Phone Support */}
                    <div className="flex items-center p-3 rounded-lg border" style={{ backgroundColor: 'rgba(137, 85, 159, 0.1)', borderColor: '#89559F' }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#3CD4AB' }}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">Téléphone Support</p>
                        <a href="tel:+212522000000" className="text-white font-medium hover:text-gray-300 transition-colors">
                          +212 522 000 000
                        </a>
                      </div>
                    </div>
                    
                    {/* Working Hours */}
                    <div className="p-3 rounded-lg border" style={{ backgroundColor: 'rgba(137, 85, 159, 0.1)', borderColor: '#89559F' }}>
                      <p className="text-sm text-gray-300 mb-1">Horaires de support</p>
                      <p className="text-white text-sm">Lun-Ven: 9h-18h | Sam: 9h-13h</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationHeader; 