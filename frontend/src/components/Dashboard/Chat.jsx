import React, { useState } from 'react';

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  // Fake chat data
  const chats = [
    {
      id: 1,
      supportName: "Sophie Martin",
      supportAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      lastMessage: "Merci pour votre message, je vais vérifier ça pour vous.",
      timestamp: "Il y a 10 min",
      unread: 2,
      status: "online",
      messages: [
        { id: 1, sender: "user", text: "Bonjour, j'ai un problème avec mon investissement", time: "14:30" },
        { id: 2, sender: "support", text: "Bonjour ! Je suis Sophie, comment puis-je vous aider ?", time: "14:31" },
        { id: 3, sender: "user", text: "Mon investissement n'apparaît pas dans mon portefeuille", time: "14:32" },
        { id: 4, sender: "support", text: "Je comprends votre préoccupation. Pouvez-vous me donner le numéro de la transaction ?", time: "14:33" },
        { id: 5, sender: "user", text: "Oui, c'est la transaction #12345", time: "14:35" },
        { id: 6, sender: "support", text: "Merci pour votre message, je vais vérifier ça pour vous.", time: "14:36" }
      ]
    },
    {
      id: 2,
      supportName: "Thomas Dubois",
      supportAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
      lastMessage: "Votre demande a été traitée avec succès.",
      timestamp: "Il y a 2 heures",
      unread: 0,
      status: "online",
      messages: [
        { id: 1, sender: "user", text: "Comment puis-je retirer mes profits ?", time: "12:15" },
        { id: 2, sender: "support", text: "Bonjour ! Je suis Thomas. Pour retirer vos profits, allez dans la section 'Profits' et cliquez sur 'Retirer'.", time: "12:16" },
        { id: 3, sender: "user", text: "Combien de temps prend le retrait ?", time: "12:18" },
        { id: 4, sender: "support", text: "Le retrait est généralement traité sous 24-48 heures.", time: "12:19" },
        { id: 5, sender: "user", text: "Parfait, merci !", time: "12:20" },
        { id: 6, sender: "support", text: "Votre demande a été traitée avec succès.", time: "12:21" }
      ]
    },
    {
      id: 3,
      supportName: "Marie Leclerc",
      supportAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
      lastMessage: "Je reste à votre disposition pour toute question.",
      timestamp: "Hier",
      unread: 0,
      status: "offline",
      messages: [
        { id: 1, sender: "user", text: "Quels sont les meilleurs produits pour un profil conservateur ?", time: "Hier 16:45" },
        { id: 2, sender: "support", text: "Bonjour ! Je suis Marie. Pour un profil conservateur, je recommande les Obligations d'État et le Livret A.", time: "Hier 16:47" },
        { id: 3, sender: "user", text: "Quel est le rendement moyen ?", time: "Hier 16:50" },
        { id: 4, sender: "support", text: "Les Obligations d'État offrent environ 3-4% par an, et le Livret A environ 2-3%.", time: "Hier 16:52" },
        { id: 5, sender: "user", text: "Merci pour ces informations !", time: "Hier 16:55" },
        { id: 6, sender: "support", text: "Je reste à votre disposition pour toute question.", time: "Hier 16:56" }
      ]
    },
    {
      id: 4,
      supportName: "Lucas Bernard",
      supportAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
      lastMessage: "N'hésitez pas à me recontacter si besoin.",
      timestamp: "Il y a 2 jours",
      unread: 0,
      status: "offline",
      messages: [
        { id: 1, sender: "user", text: "Comment fonctionne la simulation d'investissement ?", time: "Il y a 2 jours 10:30" },
        { id: 2, sender: "support", text: "Bonjour ! Je suis Lucas. La simulation vous permet de voir les rendements potentiels sans investir réellement.", time: "Il y a 2 jours 10:32" },
        { id: 3, sender: "user", text: "C'est gratuit ?", time: "Il y a 2 jours 10:35" },
        { id: 4, sender: "support", text: "Oui, la simulation est totalement gratuite et vous pouvez en créer autant que vous voulez.", time: "Il y a 2 jours 10:36" },
        { id: 5, sender: "user", text: "Super, merci !", time: "Il y a 2 jours 10:38" },
        { id: 6, sender: "support", text: "N'hésitez pas à me recontacter si besoin.", time: "Il y a 2 jours 10:39" }
      ]
    },
    {
      id: 5,
      supportName: "Emma Rousseau",
      supportAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      lastMessage: "Votre compte a été vérifié avec succès.",
      timestamp: "Il y a 3 jours",
      unread: 0,
      status: "online",
      messages: [
        { id: 1, sender: "user", text: "Je n'arrive pas à vérifier mon compte", time: "Il y a 3 jours 14:00" },
        { id: 2, sender: "support", text: "Bonjour ! Je suis Emma. Pouvez-vous me dire quelle étape pose problème ?", time: "Il y a 3 jours 14:02" },
        { id: 3, sender: "user", text: "Je n'ai pas reçu l'email de vérification", time: "Il y a 3 jours 14:05" },
        { id: 4, sender: "support", text: "Je vais vous renvoyer l'email. Vérifiez aussi vos spams.", time: "Il y a 3 jours 14:06" },
        { id: 5, sender: "user", text: "Je l'ai reçu, merci !", time: "Il y a 3 jours 14:10" },
        { id: 6, sender: "support", text: "Votre compte a été vérifié avec succès.", time: "Il y a 3 jours 14:12" }
      ]
    }
  ];

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-[#0F0F19]">
      {/* Chat List - Left Sidebar */}
      <div className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-white/10 flex flex-col`}>
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white mb-3">Messages</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 pl-10 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none text-sm"
            />
            <svg className="w-5 h-5 text-white/40 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                selectedChat?.id === chat.id ? 'bg-white/10' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.supportAvatar}
                    alt={chat.supportName}
                    className="w-12 h-12 rounded-full"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0F0F19] ${
                      chat.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  ></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold text-sm truncate">{chat.supportName}</h3>
                    <span className="text-white/40 text-xs ml-2">{chat.timestamp}</span>
                  </div>
                  <p className="text-white/60 text-sm truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="flex-shrink-0">
                    <span className="bg-[#3CD4AB] text-[#0F0F19] text-xs font-bold px-2 py-1 rounded-full">
                      {chat.unread}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages - Right Panel */}
      <div className={`${selectedChat ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBackToList}
                  className="md:hidden text-white hover:text-[#3CD4AB] mr-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="relative">
                  <img
                    src={selectedChat.supportAvatar}
                    alt={selectedChat.supportName}
                    className="w-10 h-10 rounded-full"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0F0F19] ${
                      selectedChat.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  ></span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">{selectedChat.supportName}</h3>
                  <p className="text-white/60 text-xs">
                    {selectedChat.status === 'online' ? 'En ligne' : 'Hors ligne'}
                  </p>
                </div>
              </div>
              <button className="text-white/60 hover:text-white p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.sender === 'user'
                        ? 'bg-[#3CD4AB] text-[#0F0F19]'
                        : 'bg-white/10 text-white'
                    } rounded-lg p-3`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        message.sender === 'user' ? 'text-[#0F0F19]/60' : 'text-white/40'
                      }`}
                    >
                      {message.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10 pb-6 lg:pb-4">
              <div className="flex items-center space-x-2">
                <button className="text-white/60 hover:text-white p-2 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Tapez votre message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none text-sm"
                />
                <button className="bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] p-2 rounded-lg transition-colors flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-20 h-20 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-white/60 text-lg mb-2">Sélectionnez une conversation</h3>
              <p className="text-white/40 text-sm">Choisissez une conversation dans la liste pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
