import React from 'react';

const NotificationHistory = ({ notificationHistory, getNotificationIcon }) => {
  return (
    <div className="flex gap-4 flex-col-reverse">
      <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-lg shadow backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-4">
          Historique des Notifications
        </h3>
        <div className={`space-y-4 relative ${notificationHistory.length >= 5 ? "pt-10" : ""}`}>
          {notificationHistory.length >= 5 && (
            <div className="absolute -top-2 right-0 flex gap-2">
              <button
                onClick={() => {
                  const el = document.getElementById('notifHistory');
                  if (!el) return;
                  el.scrollBy({ top: -80, behavior: 'smooth' });
                }}
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs border border-white/10"
              >
                ↑
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('notifHistory');
                  if (!el) return;
                  el.scrollBy({ top: 80, behavior: 'smooth' });
                }}
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs border border-white/10"
              >
                ↓
              </button>
            </div>
          )}
          <div 
            id="notifHistory" 
            className={`${notificationHistory.length >= 5 ? "max-h-80 overflow-y-scroll no-scrollbar" : ""}`} 
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="space-y-4">
              {notificationHistory.length > 0 ? (
                notificationHistory.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-3 p-4 bg-white/5 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-[#3CD4AB]/20 rounded-full flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-white/60 text-sm mt-1">
                        {notification.message}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-white/40 text-xs">
                          Lu le {notification.readAt}
                        </span>
                        <span className="text-[#3CD4AB] text-xs">
                          ✓ Lu
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-white/60 py-8">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-white/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M15 17h5l-5 5v-5zM12 19l-7-7 3-3 7 7-3 3z"
                    ></path>
                  </svg>
                  <p>Aucune notification lue pour le moment</p>
                  <p className="text-sm mt-1">
                    Les notifications que vous marquez comme lues apparaîtront ici
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationHistory;