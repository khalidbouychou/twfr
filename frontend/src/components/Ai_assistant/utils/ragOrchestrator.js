/**
 * RAG Orchestrator - Combines knowledge base and web search with LLM
 */

import { searchKnowledge, formatContextForLLM } from "../data/knowledgeBase.js";
import {
  webSearch,
  formatWebSearchForLLM,
} from "../services/webSearchService.js";
import { generateRAGResponse } from "../services/llmService.js";

/**
 * Determine if query needs web search
 */
const needsWebSearch = (query) => {
  const webSearchKeywords = [
    "actualité",
    "news",
    "récent",
    "aujourd'hui",
    "maintenant",
    "cours",
    "price",
    "cotation",
    "taux de change",
    "devise",
    "dernier",
    "latest",
    "current",
    "real-time",
  ];

  const queryLower = query.toLowerCase();
  return webSearchKeywords.some((keyword) => queryLower.includes(keyword));
};

/**
 * Main RAG pipeline
 * @param {string} userQuery - User's question
 * @param {Object} userProfile - User's profile data (balance, investments, etc.)
 * @returns {Promise<Object>} - AI response with sources
 */
export const processRAGQuery = async (userQuery, userProfile = {}) => {
  const startTime = Date.now();

  try {
    // Step 1: Search knowledge base (always)
    const knowledgeResults = searchKnowledge(userQuery, 3);
    const knowledgeContext = formatContextForLLM(knowledgeResults);

    // Step 2: Determine if web search is needed
    const requiresWebSearch = needsWebSearch(userQuery);
    let webContext = "";
    let webResults = null;

    if (requiresWebSearch) {
      webResults = await webSearch(userQuery);
      if (webResults.success) {
        webContext = formatWebSearchForLLM(webResults);
      }
    }

    // Step 3: Combine contexts
    const fullContext = `
${knowledgeContext}

${webContext}
    `.trim();

    // Step 4: Generate response using LLM
    const aiResponse = await generateRAGResponse(
      userQuery,
      fullContext,
      userProfile
    );

    const processingTime = Date.now() - startTime;

    return {
      success: true,
      response: aiResponse,
      sources: {
        knowledgeBase: knowledgeResults.length > 0,
        knowledgeCount: knowledgeResults.length,
        webSearch: webResults?.success || false,
        webSources: webResults?.sources?.length || 0,
      },
      processingTime: processingTime,
      query: userQuery,
    };
  } catch (error) {
    // User-friendly error message
    let userMessage;

    if (error.message === "RATE_LIMIT") {
      // Rate limit error - simple message
      userMessage = "Attendez 2 minutes et réessayez.";
    } else if (error.message === "API_ERROR" || error.message.includes("API")) {
      // Generic API error - simple message
      userMessage = "Attendez 2 minutes et réessayez.";
    } else if (
      error.message.includes("API key") ||
      error.message.includes("not configured")
    ) {
      // Configuration error - still needs to be specific
      userMessage =
        "Service temporairement indisponible. Attendez 2 minutes et réessayez.";
    } else {
      // Any other error
      userMessage = "Attendez 2 minutes et réessayez.";
    }

    // Fallback response
    return {
      success: false,
      response: userMessage,
      error: error.message,
      sources: {
        knowledgeBase: false,
        webSearch: false,
      },
    };
  }
};

/**
 * Quick response for simple queries without full RAG pipeline
 */
export const getQuickResponse = (query, userProfile = {}) => {
  const queryLower = query.toLowerCase();
  const balance = Number(userProfile.balance) || 0;
  const investmentCount = Number(userProfile.investmentCount) || 0;
  const performance = Number(userProfile.performance) || 0;

  // Simple pattern matching for very common queries
  const patterns = {
    solde: () => `Votre solde actuel est de ${balance.toLocaleString()} MAD.`,
    combien: () =>
      investmentCount === 0
        ? `Vous n'avez pas encore d'investissements. Commencez dès maintenant !`
        : `Vous avez ${investmentCount} investissement${
            investmentCount > 1 ? "s" : ""
          }.`,
    performance: () =>
      `Votre performance globale est de ${performance.toFixed(2)}%.`,
    bonjour: () =>
      `Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider avec vos investissements ?`,
    merci: () => `De rien ! N'hésitez pas si vous avez d'autres questions.`,
    aide: () =>
      `Je peux vous aider avec : analyse de portefeuille, conseils d'investissement, stratégies, gestion des risques, et bien plus. Que souhaitez-vous savoir ?`,
  };

  for (const [keyword, response] of Object.entries(patterns)) {
    if (queryLower.includes(keyword)) {
      return {
        isQuick: true,
        response: response(),
      };
    }
  }

  return null;
};

export default {
  processRAGQuery,
  getQuickResponse,
  needsWebSearch,
};
