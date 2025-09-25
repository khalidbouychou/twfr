import React from 'react';

const NotificationDetailsPopup = ({ 
  showNotificationDetails,
  selectedNotification,
  setShowNotificationDetails,
  getNotificationIcon,
  handleMarkAsRead
}) => {
  if (!showNotificationDetails || !selectedNotification) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0F0F19] border border-white/20 rounded-lg p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#3CD4AB]/20 rounded-full flex items-center justify-center">
              {getNotificationIcon(selectedNotification.type)}
            </div>
            <h3 className="text-xl font-bold text-white">
              {selectedNotification.title}
            </h3>
          </div>
          <button
            onClick={() => setShowNotificationDetails(false)}
            className="text-white/60 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="mb-4 p-4 bg-white/5 rounded-lg">
            <p className="text-white text-sm leading-relaxed">
              {selectedNotification.details}
            </p>
          </div>

          <div className="mb-4 p-4 bg-[#3CD4AB]/10 border border-[#3CD4AB]/20 rounded-lg">
            <h4 className="text-[#3CD4AB] font-semibold text-sm mb-2">
              Astuce
            </h4>
            <p className="text-white/80 text-sm">
              {selectedNotification.astuce}
            </p>
          </div>

          <div className="text-white/60 text-xs">
            Reçu {selectedNotification.time}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowNotificationDetails(false)}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Fermer
          </button>
          <button
            onClick={() => handleMarkAsRead(selectedNotification.id)}
            className="flex-1 bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Marquer comme lu
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailsPopup;