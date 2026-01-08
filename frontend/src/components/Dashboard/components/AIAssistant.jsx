import React, { useState, useRef, useEffect } from "react";
import {
  BotMessageSquare,
  Sparkles,
  Database,
  Globe,
  RefreshCw,
} from "lucide-react";
import {
  processRAGQuery,
  getQuickResponse,
} from "../../Ai_assistant/utils/ragOrchestrator";

const AIAssistant = ({
  isOpen,
  onClose,
  userBalance,
  userInvestments,
  portfolioData,
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "Salut ! Je suis votre assistant Tawfir Ai. Je peux analyser votre portefeuille, vous donner des conseils personnalisés et répondre à vos questions sur l'investissement. Comment puis-je vous aider ?",
      timestamp: new Date(),
      sources: null,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingStage, setThinkingStage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClearContext = () => {
    setMessages([
      {
        id: 1,
        type: "assistant",
        content:
          "Salut ! Je suis votre assistant Tawfir Ai. Je peux analyser votre portefeuille, vous donner des conseils personnalisés et répondre à vos questions sur l'investissement. Comment puis-je vous aider ?",
        timestamp: new Date(),
        sources: null,
      },
    ]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI response generator using RAG pipeline
  const generateAIResponse = async (userMessage) => {
    setIsLoading(true);

    // Thinking stages for visual feedback
    const thinkingStages = [
      { stage: "🔍 Searching knowledge base...", icon: Database },
      { stage: "🌐 Searching web if needed...", icon: Globe },
      { stage: "🤖 Processing with LLM...", icon: Sparkles },
      { stage: "✨ Generating response...", icon: BotMessageSquare },
    ];

    let stageIndex = 0;
    setThinkingStage(thinkingStages[0].stage);

    // Rotate through thinking stages
    const stageInterval = setInterval(() => {
      stageIndex = (stageIndex + 1) % thinkingStages.length;
      setThinkingStage(thinkingStages[stageIndex].stage);
    }, 1000);

    try {
      // Build user profile context
      const totalInvested =
        userInvestments?.reduce(
          (sum, inv) => sum + (parseFloat(inv.valueInvested) || 0),
          0
        ) || 0;
      const investmentCount = userInvestments?.length || 0;
      const globalPerf = Number(portfolioData?.globalPerformance) || 0;
      const safeBalance = Number(userBalance) || 0;

      const userProfile = {
        balance: safeBalance,
        investmentCount: investmentCount,
        totalInvested: totalInvested,
        performance: globalPerf,
      };

      // Try quick response first for simple queries
      const quickResponse = getQuickResponse(userMessage, userProfile);
      if (quickResponse) {
        clearInterval(stageInterval);
        setIsLoading(false);
        return {
          content: quickResponse.response,
          sources: null,
          processingTime: 100,
        };
      }

      // Use full RAG pipeline
      const result = await processRAGQuery(userMessage, userProfile);

      clearInterval(stageInterval);
      setIsLoading(false);

      if (result.success) {
        return {
          content: result.response,
          sources: result.sources,
          processingTime: result.processingTime,
        };
      } else {
        return {
          content: result.response,
          sources: null,
          error: true,
        };
      }
    } catch (error) {
      clearInterval(stageInterval);
      setIsLoading(false);

      // Always show simple user-friendly message
      return {
        content: "Attendez 2 minutes et réessayez.",
        sources: null,
        error: true,
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Generate AI response using RAG
    const aiResponseData = await generateAIResponse(inputMessage);

    const assistantMessage = {
      id: Date.now() + 1,
      type: "assistant",
      content: aiResponseData.content,
      timestamp: new Date(),
      sources: aiResponseData.sources,
      processingTime: aiResponseData.processingTime,
      error: aiResponseData.error || false,
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#0F0F19] border border-white/20 rounded-xl w-full max-w-2xl h-[900px] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F0F19] border-2 border-[#3CD4AB] flex items-center justify-center relative">
              <BotMessageSquare
                className="w-6 h-6 text-[#3CD4AB]"
                strokeWidth={2}
              />
              <Sparkles className="w-3 h-3 text-[#3CD4AB] absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">
                  Assistant Tawfir Ai
                </h3>
                {/* <span className="px-2 py-0.5 text-[10px] bg-[#3CD4AB]/20 text-[#3CD4AB] rounded-full border border-[#3CD4AB]/30">
                  RAG + LLM
                </span> */}
              </div>
              <p className="text-white/60 text-xs">
                Powered by Knowledge Base & Real-time Web Search
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearContext}
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              title="Effacer la conversation"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              title="Fermer"
            >
              <svg
                className="w-5 h-5"
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
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === "user"
                    ? "bg-[#3CD4AB] text-[#0F0F19]"
                    : message.error
                    ? "bg-red-500/10 text-white border border-red-500/30"
                    : "bg-white/10 text-white border border-white/20"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>

                <span
                  className={`text-xs mt-1 block ${
                    message.type === "user"
                      ? "text-[#0F0F19]/70"
                      : "text-white/60"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* Enhanced Loading indicator with RAG pipeline stages */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-white border border-white/20 rounded-lg p-4 relative overflow-hidden max-w-[80%]">
                {/* Shimmer effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3CD4AB]/10 to-transparent animate-pulse"></div>

                <div className="relative flex items-center gap-3">
                  {/* Robot thinking animation */}
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#3CD4AB] animate-pulse" />

                    {/* Thinking dots */}
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#3CD4AB] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#3CD4AB] rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#3CD4AB] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>

                  {/* Thinking text */}
                  <div className="flex items-center">
                    <span className="text-sm text-[#3CD4AB] font-medium animate-pulse">
                      AI Thinking
                    </span>
                  </div>
                </div>

                {/* RAG Pipeline stage */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex space-x-1">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 bg-white/30 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="mt-1 text-xs text-white/50">
                  {thinkingStage}
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              "Analyser mon portefeuille",
              "Conseils diversification",
              "Actualités marché",
              "Stratégies long terme",
              "Gestion des risques",
              "Performance actions",
              "Taux de change MAD",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputMessage(suggestion)}
                disabled={isLoading}
                className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 text-white/80 rounded-full border border-white/20 transition-colors hover:border-[#3CD4AB]/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
