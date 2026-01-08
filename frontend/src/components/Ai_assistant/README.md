# AI Assistant with RAG (Retrieval Augmented Generation)

## 🚀 Overview

The Tawfir AI Assistant is now powered by a complete RAG pipeline that combines:

- **Knowledge Base**: Pre-built database of investment knowledge
- **Web Search**: Real-time data from news, market quotes, and exchange rates
- **LLM Integration**: Free LLM APIs (Groq, OpenRouter, or Hugging Face)

## 📋 Architecture

```
User Query
    ↓
Quick Response Check (simple queries)
    ↓
Knowledge Base Search (RAG)
    ↓
Web Search (if needed - real-time data)
    ↓
Context Building
    ↓
LLM Processing (Groq API)
    ↓
Response to User
```

## 🔑 API Setup

### 1. Get a FREE Groq API Key (Recommended - Fastest)

1. Visit: https://console.groq.com/keys
2. Sign up for a free account
3. Create a new API key
4. Copy the key

**Models Available:**

- `mixtral-8x7b-32768` (Best for French, default)
- `llama3-70b-8192` (Most powerful)
- `llama3-8b-8192` (Fastest)
- `gemma-7b-it` (Efficient)

### 2. Alternative: OpenRouter (Multiple Models)

1. Visit: https://openrouter.ai/keys
2. Sign up and get free credits
3. Supports many models including GPT-3.5, Claude, etc.

### 3. Alternative: Hugging Face (Free Inference)

1. Visit: https://huggingface.co/settings/tokens
2. Create a token
3. Access to many open-source models

## ⚙️ Configuration

### Step 1: Add API Key to .env

Open `/workspaces/twfr/frontend/.env` and add:

```env
# LLM API Configuration (Choose ONE)
VITE_GROQ_API_KEY=gsk_your_actual_key_here

# OR use OpenRouter
# VITE_OPENROUTER_API_KEY=sk-or-your_key_here

# OR use Hugging Face
# VITE_HUGGINGFACE_API_KEY=hf_your_key_here
```

### Step 2: Restart Development Server

```bash
cd /workspaces/twfr/frontend
npm run dev
```

## 📁 Project Structure

```
frontend/src/components/Ai_assistant/
├── data/
│   └── knowledgeBase.js         # Investment knowledge database
├── services/
│   ├── llmService.js            # LLM API integration (Groq, etc.)
│   └── webSearchService.js      # Web search & real-time data
└── utils/
    └── ragOrchestrator.js       # RAG pipeline coordinator
```

## 🧠 Knowledge Base

The knowledge base (`knowledgeBase.js`) contains 10+ topics:

- Platform information
- Investment strategies
- Risk management
- Asset classes (stocks, bonds, real estate)
- Beginner guides
- Portfolio rebalancing
- Performance analysis
- Tax optimization
- Market conditions
- Platform features

## 🌐 Web Search Capabilities

The assistant can search:

- **Financial News**: Latest news via NewsData API
- **Market Data**: Real-time quotes via Finnhub
- **Exchange Rates**: Currency conversion
- **General Info**: Wikipedia & DuckDuckGo
- **Web Search**: Automatic for real-time queries

## 💬 How It Works

### 1. Knowledge Base Search

```javascript
import { searchKnowledge } from "./data/knowledgeBase.js";

// Search for relevant knowledge
const results = searchKnowledge("comment diversifier", 3);
// Returns top 3 matching entries
```

### 2. Web Search (if needed)

```javascript
import { webSearch } from "./services/webSearchService.js";

// Auto-detect search type
const results = await webSearch("actualités marché");
// Returns news, market data, or general info
```

### 3. LLM Processing

```javascript
import { generateRAGResponse } from "./services/llmService.js";

// Generate contextualized response
const response = await generateRAGResponse(userQuery, context, userProfile);
```

## 🎯 Features

### Intelligent Context Awareness

- Uses user's balance, investments, and performance
- Personalizes advice based on profile
- Maintains conversation history

### Multi-Source Information

- Local knowledge base (instant)
- Real-time web data (when needed)
- Combined context for LLM

### Visual Feedback

- Shows processing stages
- Displays data sources used
- Processing time metrics

### Quick Responses

- Simple queries answered instantly
- Complex queries use full RAG pipeline
- Fallback for API errors

## 🔧 Customization

### Adding Knowledge

Edit `data/knowledgeBase.js`:

```javascript
{
  id: 11,
  category: "new_category",
  topic: "Your Topic",
  content: `Detailed content...`,
  keywords: ["keyword1", "keyword2"],
  weight: 1.0
}
```

### Changing LLM Provider

In `utils/ragOrchestrator.js`:

```javascript
// Change from Groq to OpenRouter
const result = await processRAGQuery(query, profile, {
  provider: "openrouter",
  model: "anthropic/claude-3-haiku",
});
```

### Adjusting Search Sensitivity

In `data/knowledgeBase.js`:

```javascript
// Get more results
const results = searchKnowledge(query, 5); // top 5 instead of 3
```

## 🐛 Troubleshooting

### "API key not configured" Error

**Solution**: Make sure you've added the API key to `.env` file:

```env
VITE_GROQ_API_KEY=gsk_actual_key_here
```

Then restart the dev server.

### LLM Response is Slow

**Solutions**:

1. Try a faster model: `llama3-8b-8192`
2. Reduce context size in knowledge search
3. Use quick response for simple queries

### No Web Search Results

**Check**:

1. Internet connection
2. API keys for NewsData and Finnhub in `.env`
3. Query format (include keywords like "actualité", "cours", etc.)

### CORS Errors

**Solution**: Some free APIs may have CORS restrictions. Consider:

1. Using a proxy server
2. Implementing a backend endpoint
3. Using alternative APIs

## 📊 Performance

**Typical Response Times**:

- Quick responses: <100ms
- Knowledge base only: 1-2 seconds
- With web search: 2-4 seconds
- Full RAG pipeline: 1.5-3 seconds

**Token Usage** (Groq free tier):

- ~500 tokens per query average
- ~14,000 requests/day with free tier
- Mixtral: Very generous limits

## 🚀 Future Enhancements

Potential improvements:

- [ ] Vector database for semantic search (Pinecone, Weaviate)
- [ ] Conversation memory across sessions
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] PDF/document analysis
- [ ] Fine-tuned model on financial data
- [ ] Caching for common queries
- [ ] Streaming responses
- [ ] User feedback loop

## 📝 Example Queries

The assistant can handle:

**Portfolio Analysis**:

- "Analyse mon portefeuille"
- "Comment améliorer ma performance?"

**Market Data**:

- "Actualités marché aujourd'hui"
- "Cours de l'action AAPL"
- "Taux de change MAD USD"

**Investment Advice**:

- "Conseils diversification"
- "Stratégies long terme"
- "Gestion des risques"

**Learning**:

- "C'est quoi le DCA?"
- "Différence actions obligations"
- "Comment rééquilibrer portefeuille"

## 🔐 Security Notes

- Never commit `.env` file to Git
- Keep API keys secret
- Use environment variables for all sensitive data
- Rotate keys periodically
- Monitor API usage

## 📄 License

Part of the Tawfir investment platform.

## 🤝 Support

For issues or questions:

1. Check this README
2. Review console logs for errors
3. Verify API key configuration
4. Test with simple queries first

---

**Built with ❤️ for Tawfir - Smart Investment Platform**
