import React, { useState, useRef, useEffect } from 'react';

const AIAssistant = ({ isOpen, onClose, userBalance, userInvestments, portfolioData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Salut ! Je suis votre assistant IA pour les investissements. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI responses with context-aware logic and realistic thinking process
  const generateAIResponse = async (userMessage) => {
    setIsLoading(true);
    
    // Thinking messages rotation
    const thinkingMessages = [
      'Analysing your portfolio...',
      'Calculating investment metrics...',
      'Reviewing market conditions...',
      'Processing your question...',
      'Generating personalized advice...',
      'Checking diversification strategy...',
      'Evaluating risk factors...'
    ];
    
    let currentThinkingIndex = 0;
    setThinkingMessage(thinkingMessages[0]);
    
    // Simulate realistic AI thinking with changing messages
    const thinkingInterval = setInterval(() => {
      currentThinkingIndex = (currentThinkingIndex + 1) % thinkingMessages.length;
      setThinkingMessage(thinkingMessages[currentThinkingIndex]);
    }, 800);
    
    // Simulate processing delay (1.5-3 seconds)
    const processingTime = 1500 + Math.random() * 1500;
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    clearInterval(thinkingInterval);
    
    try {
      // Context-aware responses based on user data
      const totalInvested = userInvestments?.reduce((sum, inv) => sum + (parseFloat(inv.valueInvested) || 0), 0) || 0;
      const investmentCount = userInvestments?.length || 0;
      const globalPerf = portfolioData?.globalPerformance || 0;
      
      // Create context for the AI
      const context = `
        Utilisateur: Solde: ${userBalance?.toLocaleString() || 0} MAD, 
        Investissements: ${investmentCount} (total: ${totalInvested.toLocaleString()} MAD), 
        Performance: ${globalPerf.toFixed(2)}%
      `;

      const message = userMessage.toLowerCase();
      let response = '';

      // Quick pattern matching for common queries
      if (message.includes('solde') || message.includes('balance')) {
        response = `Votre solde actuel est de ${userBalance?.toLocaleString() || 0} MAD. ${userBalance > 10000 ? 'Vous avez un bon solde pour diversifier vos investissements !' : 'Considérez augmenter votre solde pour plus d\'opportunités d\'investissement.'}`;
      } else if (message.includes('investissement') || message.includes('invest')) {
        response = `Vous avez actuellement ${investmentCount} investissement(s) pour un total de ${totalInvested.toLocaleString()} MAD. ${investmentCount < 3 ? 'Je recommande de diversifier davantage votre portefeuille.' : 'Votre portefeuille semble bien diversifié !'}`;
      } else if (message.includes('performance') || message.includes('rendement')) {
        response = `Votre performance globale est de ${globalPerf.toFixed(2)}%. ${globalPerf > 5 ? 'Excellente performance !' : globalPerf > 0 ? 'Performance positive, continuez ainsi !' : 'Les marchés peuvent fluctuer, restez patient sur le long terme.'}`;
      } else if (message.includes('conseil') || message.includes('recommandation')) {
        response = getPersonalizedAdvice(userBalance, investmentCount, totalInvested, globalPerf);
      } else if (message.includes('diversification')) {
        response = getDiversificationAdvice(userInvestments);
      } else if (message.includes('risque')) {
        response = getRiskManagementAdvice(totalInvested, globalPerf);
      } else if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
        response = `Bonjour ! Ravi de vous aider avec vos investissements. Avec ${userBalance?.toLocaleString() || 0} MAD de solde et ${investmentCount} investissement(s), que souhaitez-vous savoir ?`;
      } else if (message.includes('merci')) {
        response = `De rien ! Je suis là pour vous accompagner dans votre parcours d'investissement. N'hésitez pas si vous avez d'autres questions !`;
      } else {
        // Try to use a more sophisticated response
        response = await getAdvancedResponse(userMessage, context);
      }

      setIsLoading(false);
      return response;
    } catch {
      setIsLoading(false);
      return `Je rencontre une petite difficulté technique. Pouvez-vous reformuler votre question ? En attendant, je peux vous aider avec vos investissements, analyser votre portefeuille, ou donner des conseils financiers.`;
    }
  };

  // Helper functions for more detailed responses
  const getPersonalizedAdvice = (balance, count, invested, performance) => {
    let advice = "Voici mes conseils personnalisés : ";
    
    if (balance < 5000) {
      advice += "1) Constituez d'abord une épargne de sécurité, ";
    }
    if (count < 3) {
      advice += "2) Diversifiez votre portefeuille sur au moins 3-5 produits différents, ";
    }
    if (performance < 0) {
      advice += "3) Réévaluez votre stratégie et considérez des investissements plus stables, ";
    }
    
    advice += "4) Investissez régulièrement (DCA), 5) Gardez une vision long terme. Voulez-vous des détails sur un point spécifique ?";
    return advice;
  };

  const getDiversificationAdvice = (investments) => {
    const sectors = [...new Set(investments?.map(inv => inv.category) || [])];
    return `Vous investissez dans ${sectors.length} secteur(s). Pour une diversification optimale, visez 4-6 secteurs différents : Finance, Technologie, Immobilier, Matières premières, Santé, et Énergie. Cela réduit les risques sectoriels.`;
  };

  const getRiskManagementAdvice = (invested, performance) => {
    return `Avec ${invested.toLocaleString()} MAD investis et une performance de ${performance.toFixed(2)}%, voici mes conseils de gestion des risques : 1) Ne jamais investir plus de 5-10% dans un seul actif, 2) Adapter l'allocation selon votre âge (100 - âge = % actions), 3) Rééquilibrer votre portefeuille trimestriellement.`;
  };

  const getAdvancedResponse = async (message, context) => {
    // Fallback to structured response based on keywords
    const keywords = {
      'stratégie': 'Pour développer une stratégie d\'investissement efficace, considérez votre horizon temporel, votre tolérance au risque, et vos objectifs financiers.',
      'long terme': 'Les investissements long terme (>5 ans) permettent de lisser la volatilité et de bénéficier de la croissance composée.',
      'actions': 'Les actions offrent un potentiel de croissance élevé mais avec plus de volatilité. Elles conviennent aux horizons longs.',
      'obligations': 'Les obligations apportent stabilité et revenus réguliers, idéales pour diversifier un portefeuille.',
      'immobilier': 'L\'investissement immobilier (REIT/SCPI) offre diversification et revenus locatifs avec une exposition aux marchés immobiliers.'
    };

    for (const [keyword, response] of Object.entries(keywords)) {
      if (message.toLowerCase().includes(keyword)) {
        return response + ' ' + context;
      }
    }

    return `Merci pour votre question sur "${message}". En tant qu'assistant spécialisé en investissements, je peux vous aider à analyser votre portefeuille, définir une stratégie adaptée, ou expliquer les différents produits financiers. Que souhaitez-vous approfondir ?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Generate AI response
    const aiResponse = await generateAIResponse(inputMessage);
    
    const assistantMessage = {
      id: Date.now() + 1,
      type: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0F0F19] border border-white/20 rounded-xl w-full max-w-2xl h-[600px] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3CD4AB] to-emerald-400 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                {/* Robot head */}
                <rect x="6" y="6" width="12" height="10" rx="2" fill="currentColor"/>
                {/* Robot antenna */}
                <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="2" r="1.5" fill="currentColor"/>
                {/* Robot eyes */}
                <circle cx="9" cy="10" r="1.5" fill="white"/>
                <circle cx="15" cy="10" r="1.5" fill="white"/>
                {/* Robot mouth */}
                <rect x="10" y="13" width="4" height="1" fill="white"/>
                {/* Robot body */}
                <rect x="8" y="16" width="8" height="6" rx="1" fill="currentColor"/>
                {/* Robot arms */}
                <rect x="4" y="18" width="3" height="2" rx="1" fill="currentColor"/>
                <rect x="17" y="18" width="3" height="2" rx="1" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Assistant IA Tawfir</h3>
              <p className="text-white/60 text-sm">Votre conseiller en investissements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-[#3CD4AB] text-[#0F0F19]'
                    : 'bg-white/10 text-white border border-white/20'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className={`text-xs mt-1 block ${
                  message.type === 'user' ? 'text-[#0F0F19]/70' : 'text-white/60'
                }`}>
                  {message.timestamp.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))}
          
          {/* Enhanced Loading indicator with "Thinking..." */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-white border border-white/20 rounded-lg p-4 relative overflow-hidden">
                {/* Shimmer effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
                
                <div className="relative flex items-center gap-3">
                  {/* Robot thinking animation */}
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#3CD4AB] animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      {/* Mini robot head */}
                      <rect x="7" y="8" width="10" height="8" rx="1.5" fill="currentColor"/>
                      {/* Mini robot antenna */}
                      <line x1="12" y1="4" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="12" cy="4" r="1" fill="currentColor"/>
                      {/* Mini robot eyes */}
                      <circle cx="10" cy="11" r="1" fill="white"/>
                      <circle cx="14" cy="11" r="1" fill="white"/>
                      {/* Mini robot mouth */}
                      <rect x="11" y="13.5" width="2" height="0.5" fill="white"/>
                      {/* Mini robot body */}
                      <rect x="9" y="16" width="6" height="4" rx="0.5" fill="currentColor"/>
                    </svg>
                    
                    {/* Thinking dots */}
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#3CD4AB] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#3CD4AB] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[#3CD4AB] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                  
                  {/* Thinking text with typewriter effect */}
                  <div className="flex items-center">
                    <span className="text-sm text-[#3CD4AB] font-medium animate-pulse">
                      Thinking
                    </span>
                    <span className="text-sm text-[#3CD4AB] ml-1 animate-ping">...</span>
                  </div>
                </div>
                
                {/* Additional thinking indicators */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex space-x-1">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 bg-white/30 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                  <span className="text-xs text-white/50">{thinkingMessage || 'Processing...'}</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question sur les investissements..."
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:border-[#3CD4AB] focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-[#3CD4AB] hover:bg-[#3CD4AB]/80 text-[#0F0F19] font-medium px-6 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              'Analyser mon portefeuille', 
              'Conseils diversification', 
              'Stratégies long terme', 
              'Gestion des risques',
              'Comment investir 10000 MAD ?',
              'Quand rééquilibrer ?'
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputMessage(suggestion)}
                className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-white/80 rounded-full border border-white/20 transition-colors hover:border-[#3CD4AB]/50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;