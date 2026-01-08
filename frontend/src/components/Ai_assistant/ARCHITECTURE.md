# 🏗️ AI Assistant Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                          │
│                   (AIAssistant.jsx)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Input: User Question                                 │  │
│  │  Output: AI Response + Sources + Processing Time     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   RAG ORCHESTRATOR                          │
│              (ragOrchestrator.js)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. Quick Response Check (simple queries)            │  │
│  │     └→ Instant answer if applicable                  │  │
│  │                                                        │  │
│  │  2. Knowledge Base Search                            │  │
│  │     └→ Find relevant investment info                 │  │
│  │                                                        │  │
│  │  3. Web Search (if needed)                           │  │
│  │     └→ Get real-time data                            │  │
│  │                                                        │  │
│  │  4. Combine Context                                  │  │
│  │     └→ Build comprehensive context                   │  │
│  │                                                        │  │
│  │  5. Call LLM                                         │  │
│  │     └→ Generate personalized response                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
              ↓                    ↓                    ↓
    ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐
    │  KNOWLEDGE BASE │  │   WEB SEARCH     │  │   LLM SERVICE   │
    │  (Local Data)   │  │ (External APIs)  │  │  (Groq API)     │
    └─────────────────┘  └──────────────────┘  └─────────────────┘
```

## Component Details

### 1. AIAssistant Component (UI Layer)

```
┌───────────────────────────────────────┐
│         AI Assistant Interface        │
├───────────────────────────────────────┤
│  Header:                              │
│    - Title: "Assistant Tawfir Ai"    │
│    - Badge: "RAG + LLM"              │
│    - Description: "Powered by..."    │
├───────────────────────────────────────┤
│  Messages Area:                       │
│    - User messages (right, green)    │
│    - AI responses (left, white)      │
│    - Source badges                   │
│    - Processing time                 │
│    - Timestamps                      │
├───────────────────────────────────────┤
│  Loading State:                       │
│    - "AI Thinking" animation         │
│    - Pipeline stages display         │
│    - Progress indicators             │
├───────────────────────────────────────┤
│  Input Area:                          │
│    - Text input field                │
│    - Send button                     │
│    - Quick suggestion buttons        │
└───────────────────────────────────────┘
```

### 2. RAG Pipeline Flow

```
User Query: "Comment diversifier mon portefeuille?"
    ↓
┌───────────────────────────────────────────────┐
│ Step 1: Quick Response Check                 │
│ - Check if simple query                      │
│ - If yes: Return instant answer              │
│ - If no: Continue to next step               │
└───────────────────────────────────────────────┘
    ↓
┌───────────────────────────────────────────────┐
│ Step 2: Knowledge Base Search                │
│ - Search keywords: "diversification"         │
│ - Find: 3 relevant articles                  │
│ - Topics: Investment strategies, risk mgmt   │
│ - Score: 15.5, 12.3, 8.7                     │
└───────────────────────────────────────────────┘
    ↓
┌───────────────────────────────────────────────┐
│ Step 3: Determine Web Search Need            │
│ - Check for real-time keywords              │
│ - "actualité", "cours", "taux" → YES        │
│ - Otherwise → NO                            │
└───────────────────────────────────────────────┘
    ↓ (if needed)
┌───────────────────────────────────────────────┐
│ Step 4: Web Search (Optional)                │
│ - DuckDuckGo: General info                   │
│ - NewsData: Latest news                      │
│ - Finnhub: Market quotes                     │
│ - ExchangeRate: Currency rates               │
└───────────────────────────────────────────────┘
    ↓
┌───────────────────────────────────────────────┐
│ Step 5: Build Context                        │
│                                               │
│ KNOWLEDGE BASE CONTEXT:                      │
│ [INVESTMENT - Diversification]               │
│ Les principales stratégies incluent...       │
│                                               │
│ USER PROFILE:                                │
│ Solde: 50,000 MAD                           │
│ Investissements: 2 (30,000 MAD)            │
│ Performance: 5.5%                           │
│                                               │
│ WEB CONTEXT (if available):                  │
│ [News] Latest market trends...               │
└───────────────────────────────────────────────┘
    ↓
┌───────────────────────────────────────────────┐
│ Step 6: LLM Processing (Groq)                │
│                                               │
│ System Prompt:                               │
│ "Tu es un assistant IA expert en            │
│  investissements pour Tawfir..."            │
│                                               │
│ User Profile Context                         │
│ Knowledge Base Context                       │
│ Web Search Context (if any)                  │
│                                               │
│ Model: mixtral-8x7b-32768                   │
│ Temperature: 0.7                             │
│ Max Tokens: 1024                            │
└───────────────────────────────────────────────┘
    ↓
┌───────────────────────────────────────────────┐
│ Step 7: Response Assembly                    │
│                                               │
│ Response: "Pour diversifier efficacement..." │
│                                               │
│ Metadata:                                    │
│  - Sources: KB (3), Web (0)                 │
│  - Processing Time: 1,847ms                  │
│  - Model: mixtral-8x7b-32768                │
│  - Tokens: 487                              │
└───────────────────────────────────────────────┘
    ↓
Display to User with Source Badges
```

### 3. Knowledge Base Structure

```
knowledgeBase = [
  {
    id: 1,
    category: "investment",
    topic: "Stratégies d'investissement",
    content: "Detailed content...",
    keywords: ["stratégie", "DCA", "diversification"],
    weight: 1.0
  },
  // ... 10+ more topics
]

Search Algorithm:
┌──────────────────────────────────┐
│ Input: "diversification"         │
├──────────────────────────────────┤
│ For each entry:                  │
│  1. Check keywords (weight: 3)   │
│  2. Check topic (weight: 5)      │
│  3. Check content (weight: 0.5)  │
│  4. Apply entry weight           │
│  5. Calculate total score        │
├──────────────────────────────────┤
│ Sort by score (highest first)    │
│ Return top K entries (default 3) │
└──────────────────────────────────┘
```

### 4. LLM Service Architecture

```
┌─────────────────────────────────────┐
│     LLM Service (llmService.js)     │
├─────────────────────────────────────┤
│                                     │
│  callLLM(messages, options)        │
│         ↓                           │
│  ┌──────────────────────────────┐  │
│  │  Primary Provider: Groq      │  │
│  │  - Fast (< 2 seconds)        │  │
│  │  - Free tier: 14K req/day    │  │
│  │  - Models: Mixtral, Llama3   │  │
│  └──────────────────────────────┘  │
│         ↓ (if fails)                │
│  ┌──────────────────────────────┐  │
│  │  Fallback 1: OpenRouter      │  │
│  │  - Multiple models           │  │
│  │  - Free credits              │  │
│  └──────────────────────────────┘  │
│         ↓ (if fails)                │
│  ┌──────────────────────────────┐  │
│  │  Fallback 2: Hugging Face    │  │
│  │  - Open source models        │  │
│  │  - Free inference API        │  │
│  └──────────────────────────────┘  │
│         ↓                           │
│    Return response or error         │
└─────────────────────────────────────┘
```

### 5. Web Search Service

```
┌──────────────────────────────────────────┐
│  webSearch(query, type='auto')          │
├──────────────────────────────────────────┤
│                                          │
│  Auto-detect type based on keywords:    │
│  ┌────────────────────────────────────┐ │
│  │ "actualité" → NEWS                 │ │
│  │ "cours", "price" → MARKET          │ │
│  │ "taux", "devise" → EXCHANGE        │ │
│  │ Other → GENERAL                    │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Execute appropriate search:             │
│  ┌────────────────────────────────────┐ │
│  │ NEWS:                              │ │
│  │  - NewsData API                    │ │
│  │  - Returns: articles, titles, urls │ │
│  ├────────────────────────────────────┤ │
│  │ MARKET:                            │ │
│  │  - Finnhub API                     │ │
│  │  - Returns: price, change, data    │ │
│  ├────────────────────────────────────┤ │
│  │ EXCHANGE:                          │ │
│  │  - ExchangeRate API                │ │
│  │  - Returns: rates, conversions     │ │
│  ├────────────────────────────────────┤ │
│  │ GENERAL:                           │ │
│  │  - DuckDuckGo (primary)            │ │
│  │  - Wikipedia (fallback)            │ │
│  │  - Returns: info, summaries        │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Format results for LLM context          │
└──────────────────────────────────────────┘
```

## Data Flow Example

### Example 1: Simple Query

```
User: "Mon solde"
  ↓
Quick Response Check → MATCH!
  ↓
Instant Response: "Votre solde actuel est de 50,000 MAD"
  ↓
Time: < 100ms
Sources: None (quick response)
```

### Example 2: Knowledge Base Query

```
User: "C'est quoi le DCA?"
  ↓
Quick Response Check → NO MATCH
  ↓
Knowledge Base Search
  ├─ Keyword match: "DCA" → Score 8.5
  ├─ Topic match: "Investment Strategies" → Score 12.3
  └─ Content match: Multiple mentions → Score +2.5
  ↓
Top Result: "Investment Strategies" (score: 15.0)
  ↓
Build Context (no web search needed)
  ↓
LLM Processing
  ↓
Response: "Le DCA (Dollar Cost Averaging)..."
  ↓
Time: ~1,500ms
Sources: Knowledge Base (1)
```

### Example 3: Real-time Query

```
User: "Actualités marché aujourd'hui"
  ↓
Quick Response Check → NO MATCH
  ↓
Knowledge Base Search
  └─ Found: "Market Conditions" (score: 7.2)
  ↓
Web Search Needed? → YES ("actualités")
  ↓
NewsData API Call
  └─ Returns: 3 latest financial news articles
  ↓
Build Combined Context
  ├─ Knowledge: Market fundamentals
  └─ Web: Latest news
  ↓
LLM Processing with both contexts
  ↓
Response: "Aujourd'hui, le marché montre..."
  ↓
Time: ~2,800ms
Sources: Knowledge Base (1), Web (3)
```

## Performance Metrics

```
┌─────────────────────────────────────────────┐
│            Response Times                   │
├─────────────────────────────────────────────┤
│ Quick Response:        < 100ms              │
│ Knowledge Base Only:   1,000-2,000ms        │
│ With Web Search:       2,000-4,000ms        │
│ LLM Processing:        1,000-2,000ms        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│          Resource Usage (Free)              │
├─────────────────────────────────────────────┤
│ Groq API:              14,000+ req/day      │
│ Knowledge Base:        Unlimited (local)    │
│ NewsData API:          200 req/day          │
│ Finnhub API:           60 req/min           │
│ ExchangeRate API:      1,500 req/month      │
└─────────────────────────────────────────────┘
```

## Security Model

```
┌────────────────────────────────────────┐
│          API Key Management            │
├────────────────────────────────────────┤
│ .env file (not in Git)                │
│   ↓                                    │
│ Environment variables (Vite)           │
│   ↓                                    │
│ import.meta.env.VITE_*                │
│   ↓                                    │
│ Used in API calls                      │
│   ↓                                    │
│ Never exposed to client                │
└────────────────────────────────────────┘

Note: In production, use backend proxy
for additional security
```

---

**Built with modern RAG architecture for intelligent, context-aware responses!** 🚀
