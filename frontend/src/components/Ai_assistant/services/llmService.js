/**
 * LLM API Service using Groq (Free & Fast)
 * Supports fallback to other providers
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/";

/**
 * Call Groq API (Primary - Fast & Free)
 */
export const callGroqAPI = async (
  messages,
  model = "llama-3.3-70b-versatile"
) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey === "your_groq_api_key_here") {
    throw new Error(
      "GROQ_API_KEY not configured. Get free key at: https://console.groq.com/keys"
    );
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model, // Options: llama-3.3-70b-versatile, llama-3.3-70b-specdec, qwen/qwen3-32b
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.9,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      const errorMessage = error.error?.message || "Groq API error";
      const errorType = error.error?.type || "unknown";

      // Check for rate limit errors
      if (response.status === 429 || errorType.includes("rate_limit")) {
        throw new Error("RATE_LIMIT");
      }

      // Check for quota/capacity errors
      if (errorMessage.includes("quota") || errorMessage.includes("capacity")) {
        throw new Error("RATE_LIMIT");
      }

      throw new Error("API_ERROR");
    }

    const data = await response.json();
    return {
      success: true,
      message: data.choices[0].message.content,
      model: data.model,
      usage: data.usage,
    };
  } catch (error) {
    console.error("Groq API Error:", error);
    // Re-throw with simplified error types
    if (error.message === "RATE_LIMIT" || error.message === "API_ERROR") {
      throw error;
    }
    // Network or other errors
    throw new Error("API_ERROR");
  }
};

/**
 * Call OpenRouter API (Fallback - Multiple models)
 */
export const callOpenRouterAPI = async (
  messages,
  model = "mistralai/mistral-7b-instruct"
) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Tawfir AI Assistant",
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("RATE_LIMIT");
      }
      throw new Error("API_ERROR");
    }

    const data = await response.json();
    return {
      success: true,
      message: data.choices[0].message.content,
      model: data.model,
    };
  } catch (error) {
    if (error.message === "RATE_LIMIT" || error.message === "API_ERROR") {
      throw error;
    }
    throw new Error("API_ERROR");
  }
};

/**
 * Call Hugging Face Inference API (Alternative free option)
 */
export const callHuggingFaceAPI = async (
  prompt,
  model = "mistralai/Mistral-7B-Instruct-v0.2"
) => {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY not configured");
  }

  try {
    const response = await fetch(`${HUGGINGFACE_API_URL}${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("RATE_LIMIT");
      }
      throw new Error("API_ERROR");
    }

    const data = await response.json();
    return {
      success: true,
      message: data[0].generated_text,
      model: model,
    };
  } catch (error) {
    if (error.message === "RATE_LIMIT" || error.message === "API_ERROR") {
      throw error;
    }
    throw new Error("API_ERROR");
  }
};

/**
 * Main function to call LLM with automatic fallback
 */
export const callLLM = async (messages, options = {}) => {
  const { provider = "groq", model } = options;

  // Try primary provider
  try {
    switch (provider) {
      case "groq":
        return await callGroqAPI(messages, model);
      case "openrouter":
        return await callOpenRouterAPI(messages, model);
      case "huggingface": {
        // Convert messages to single prompt for HF
        const prompt = messages
          .map((m) => `${m.role}: ${m.content}`)
          .join("\n");
        return await callHuggingFaceAPI(prompt, model);
      }
      default:
        return await callGroqAPI(messages, model);
    }
  } catch (error) {
    console.error(`Primary provider (${provider}) failed:`, error);

    // If rate limit, don't try fallbacks - just return error
    if (error.message === "RATE_LIMIT") {
      throw error;
    }

    // Try fallback providers for other errors
    if (provider !== "groq") {
      try {
        return await callGroqAPI(messages);
      } catch (fallbackError) {
        if (fallbackError.message === "RATE_LIMIT") {
          throw fallbackError;
        }
      }
    }

    if (provider !== "openrouter") {
      try {
        return await callOpenRouterAPI(messages);
      } catch (fallbackError) {
        if (fallbackError.message === "RATE_LIMIT") {
          throw fallbackError;
        }
      }
    }

    throw new Error("API_ERROR");
  }
};

/**
 * Generate AI response with RAG context
 */
export const generateRAGResponse = async (
  userQuery,
  context,
  userProfile = {}
) => {
  const systemPrompt = `Tu es un assistant IA expert en investissements pour la plateforme Tawfir. 
Tu dois fournir des conseils financiers personnalisés, précis et basés sur les données.

CONTEXTE UTILISATEUR:
${userProfile.balance ? `Solde: ${userProfile.balance} MAD` : ""}
${
  userProfile.investmentCount
    ? `Nombre d'investissements: ${userProfile.investmentCount}`
    : ""
}
${
  userProfile.totalInvested
    ? `Total investi: ${userProfile.totalInvested} MAD`
    : ""
}
${
  userProfile.performance
    ? `Performance globale: ${userProfile.performance}%`
    : ""
}

INSTRUCTIONS:
1. Utilise le contexte fourni pour répondre avec précision
2. Sois concis mais informatif (maximum 150 mots)
3. Adapte tes conseils au profil de l'utilisateur
4. Utilise un ton professionnel mais accessible
5. Fournis des chiffres et exemples concrets
6. Termine par une question ou une suggestion d'action si approprié
7. Réponds en français marocain professionnel

CONTEXTE DE LA BASE DE CONNAISSANCES:
${context}`;

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userQuery,
    },
  ];

  try {
    const response = await callLLM(messages, {
      provider: "groq",
      model: "llama-3.3-70b-versatile",
    });
    return response.message;
  } catch (error) {
    throw error;
  }
};

export default {
  callLLM,
  callGroqAPI,
  callOpenRouterAPI,
  callHuggingFaceAPI,
  generateRAGResponse,
};
