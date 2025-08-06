import React, { useState } from 'react';
import { 
  IoChevronBack, 
  IoSearch, 
  IoNotifications, 
  IoInformationCircle, 
  IoArrowForward,
  IoTrendingUp,
  IoTrendingDown
} from 'react-icons/io5';

const InvestmentDebug = () => {
  const [error, setError] = useState(null);

  try {
    return (
      <div className="min-h-screen bg-bg-dark text-white font-raleway">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-bg-dark/95 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center justify-between px-4 py-3">
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <IoChevronBack className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Portfolio Debug</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <IoSearch className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <IoNotifications className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Account Balance Section */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 text-white">
                €14,590.50
              </h2>
              <div className="flex items-center justify-center space-x-2 mb-2 text-red-400">
                <IoTrendingDown className="w-4 h-4" />
                <span className="text-sm">
                  €10.25 • -0.67%
                </span>
              </div>
              <p className="text-gray-400 text-xs">
                Last update: 4 August at 16:07
              </p>
            </div>
          </div>

          {/* Test Products */}
          <div className="bg-gray-900 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-white">Test Products</h3>
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg">
                      🏦
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Compte sur Carnet</h4>
                      <p className="text-gray-400 text-sm">Risk: 1 • COURT</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">€2,450.00</p>
                    <div className="flex items-center space-x-1 text-sm text-green-400">
                      <IoTrendingUp className="w-3 h-3" />
                      <span>€45.30 • 1.89%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg">
                      📈
                    </div>
                    <div>
                      <h4 className="font-medium text-white">OPCVM Actions</h4>
                      <p className="text-gray-400 text-sm">Risk: 7 • LONG TERME</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">€3,250.75</p>
                    <div className="flex items-center space-x-1 text-sm text-green-400">
                      <IoTrendingUp className="w-3 h-3" />
                      <span>€120.50 • 3.85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-500/20">
            <h3 className="text-lg font-semibold mb-2 text-white">Debug Information</h3>
            <p className="text-gray-300 text-sm">
              Component is rendering successfully. If you can see this, the route and component are working.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-bg-dark border-t border-gray-800 p-4">
          <div className="flex space-x-3">
            <button className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors shadow-lg">
              Sell
            </button>
            <button className="flex-1 bg-accent text-bg-dark py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors shadow-lg">
              Buy
            </button>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    setError(err.message);
    return (
      <div className="min-h-screen bg-bg-dark text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Error in Investment Component</h1>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }
};

export default InvestmentDebug; 