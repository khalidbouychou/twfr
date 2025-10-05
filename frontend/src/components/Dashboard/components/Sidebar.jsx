import React from 'react';

const Sidebar = ({ 
  sidebarOpen, 
  isSidebarHovered, 
  setIsSidebarHovered, 
  currentPage, 
  handleNavigation,
  setSidebarOpen,
  setShowAIAssistant
}) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      mobileLabel: "Accueil",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
        </svg>
      )
    },
    {
      id: "portfolio",
      label: "Portefeuille",
      mobileLabel: "Portfolio",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
        </svg>
      )
    },
    {
      id: "investments",
      label: "Investissements",
      mobileLabel: "Investir",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-.89l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      id: "simulations",
      label: "Simulations",
      mobileLabel: "Simuler",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
          <path d="M3 5a2 2 0 012-2h1V1a1 1 0 112 0v1h1a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM3 11a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4z"></path>
        </svg>
      )
    },
    {
      id: "news",
      label: "Actualités",
      mobileLabel: "News",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
        </svg>
      )
    },
    {
      id: "ai-assistant",
      label: "Assistant IA",
      mobileLabel: "Assistant",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4H8"/>
          <rect width="16" height="12" x="4" y="8" rx="2"/>
          <path d="M2 14h2"/>
          <path d="M20 14h2"/>
          <path d="M15 13v2"/>
          <path d="M9 13v2"/>
        </svg>
      ),
      isAIAssistant: true
    },
    {
      id: "messages",
      label: "Messages",
      mobileLabel: "Messages",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/>
          <path d="M7 11h10"/>
          <path d="M7 15h6"/>
          <path d="M7 7h8"/>
        </svg>
      )
    }
  ];

  const handleItemClick = (itemId, isAIAssistant = false) => {
    if (isAIAssistant) {
      setShowAIAssistant(true);
    } else {
      handleNavigation(itemId);
    }
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`hidden lg:block fixed top-0 left-0 z-40 h-screen pt-5 transition-all duration-200 ${
          isSidebarHovered ? "w-64" : "w-16"
        } bg-[#0F0F19] border-r border-white/10`}
      >
        <div className='flex items-center justify-center px-2 mb-4'>
          <a href='/' className='cursor-pointer'>
            <img 
              src="https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706711/tawfir-ai/logo.svg" 
              className={`${isSidebarHovered ? "w-10 h-10" : "w-8 h-8"} transition-all duration-200`} 
              alt="TawfirAI Logo" 
            />
          </a>
        </div>
        <div className="h-full px-3 pb-4 overflow-y-auto bg-[#0F0F19]">
          <ul className="space-y-2 pt-4">{menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => item.isAIAssistant ? setShowAIAssistant(true) : handleNavigation(item.id)}
                  className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                    currentPage === item.id && !item.isAIAssistant
                      ? "bg-[#3CD4AB] text-[#0F0F19]"
                      : "text-white hover:bg-white/10 hover:text-[#3CD4AB]"
                  }`}
                >
                  {item.icon}
                  <span className={`ml-3 transition-opacity duration-200 ${isSidebarHovered ? "opacity-100" : "opacity-0 pointer-events-none hidden"}`}>
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-[#0F0F19] border-r border-white/10 lg:hidden transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <a href='/' className='cursor-pointer'>
            <img 
              src="https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706711/tawfir-ai/logo.svg" 
              className="w-10 h-10" 
              alt="TawfirAI Logo" 
            />
          </a>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-3 py-4 overflow-y-auto h-full">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id, item.isAIAssistant)}
                  className={`flex items-center w-full p-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                    currentPage === item.id && !item.isAIAssistant
                      ? "bg-[#3CD4AB] text-[#0F0F19]"
                      : "text-white hover:bg-white/10 hover:text-[#3CD4AB]"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0F0F19] border-t border-white/10 lg:hidden">
        <div className="flex justify-around items-center h-16 px-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id, item.isAIAssistant)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                currentPage === item.id && !item.isAIAssistant
                  ? "text-[#3CD4AB]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <div className={`${currentPage === item.id && !item.isAIAssistant ? "scale-110" : "scale-100"} transition-transform duration-200`}>
                {item.icon}
              </div>
              <span className="text-xs mt-1 font-medium">{item.mobileLabel}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;