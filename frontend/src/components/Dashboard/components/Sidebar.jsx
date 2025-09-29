import React from 'react';

const Sidebar = ({ 
  sidebarOpen, 
  isSidebarHovered, 
  setIsSidebarHovered, 
  currentPage, 
  handleNavigation 
}) => {
  return (
    <aside
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
      className={`fixed top-0 left-0 z-40 h-screen pt-3 sm:pt-4 lg:pt-5 transition-all duration-200 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${isSidebarHovered ? "w-56 lg:w-64" : "w-14 lg:w-16"} bg-[#0F0F19] border-r border-white/10 lg:translate-x-0`}
    >
      <div className='flex items-center justify-center px-1 sm:px-2'>
        <a href='/' className='cursor-pointer'>
          <img 
            src="https://res.cloudinary.com/dkfrrfxa1/image/upload/v1758706711/tawfir-ai/logo.svg" 
            className={`${isSidebarHovered ? "w-8 sm:w-10 h-8 sm:h-10" : "w-6 sm:w-8 h-6 sm:h-8"}`} 
            alt="TawfirAI Logo" 
          />
        </a>
      </div>
      <div className="h-full px-2 lg:px-3 pb-4 overflow-y-auto bg-[#0F0F19]">
        <ul className="space-y-1 lg:space-y-2 pt-3 lg:pt-4">
          <li>
            <button
              onClick={() => handleNavigation("dashboard")}
              className={`flex items-center w-full p-1.5 lg:p-2 text-sm lg:text-base font-normal rounded-lg transition-colors duration-200 ${
                currentPage === "dashboard"
                  ? "bg-[#3CD4AB] text-[#0F0F19]"
                  : "text-white hover:bg-white/10 hover:text-[#3CD4AB]"
              }`}
            >
              <svg
                className="w-5 h-5 lg:w-6 lg:h-6 transition duration-75"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
              <span className={`ml-2 lg:ml-3 transition-opacity duration-200 ${isSidebarHovered ? "opacity-100" : "opacity-0 pointer-events-none hidden"}`}>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("portfolio")}
              className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                currentPage === "portfolio"
                  ? "bg-[#3CD4AB] text-[#0F0F19]"
                  : "text-white hover:bg-white/10 hover:text-[#3CD4AB]"
              }`}
            >
              <svg
                className="flex-shrink-0 w-6 h-6 transition duration-75"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
              </svg>
              <span className={`ml-3 transition-opacity duration-200 ${isSidebarHovered ? "opacity-100" : "opacity-0 pointer-events-none hidden"}`}>Portefeuille</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("investments")}
              className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                currentPage === "investments"
                  ? "bg-[#3CD4AB] text-[#0F0F19]"
                  : "text-white hover:bg-white/10 hover:text-[#3CD4AB]"
              }`}
            >
              <svg
                className="flex-shrink-0 w-6 h-6 transition duration-75"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-.89l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className={`ml-3 transition-opacity duration-200 ${isSidebarHovered ? "opacity-100" : "opacity-0 pointer-events-none hidden"}`}>Investissements</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("simulations")}
              className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                currentPage === "simulations"
                  ? "bg-[#3CD4AB] text-[#0F0F19]"
                  : "text-white hover:bg-white/10 hover:text-[#3CD4AB]"
              }`}
            >
              <svg
                className="flex-shrink-0 w-6 h-6 transition duration-75"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                <path d="M3 5a2 2 0 012-2h1V1a1 1 0 112 0v1h1a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM3 11a2 2 0 012-2h10a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4z"></path>
              </svg>
              <span className={`ml-3 transition-opacity duration-200 ${isSidebarHovered ? "opacity-100" : "opacity-0 pointer-events-none hidden"}`}>Simulations</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("news")}
              className={`flex items-center w-full p-2 text-base font-normal rounded-lg transition-colors duration-200 ${
                currentPage === "news"
                  ? "bg-[#3CD4AB] text-[#0F0F19]"
                  : "text-white hover:bg-white/10 hover:text-[#3CD4AB]"
              }`}
            >
              <svg
                className="flex-shrink-0 w-6 h-6 transition duration-75"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className={`ml-3 transition-opacity duration-200 ${isSidebarHovered ? "opacity-100" : "opacity-0 pointer-events-none hidden"}`}>Actualités</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;