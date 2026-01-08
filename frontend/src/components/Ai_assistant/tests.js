/**
 * Test file for AI Assistant RAG Pipeline
 * Run this to verify your setup
 */

import { searchKnowledge } from "./data/knowledgeBase.js";
import { webSearch } from "./services/webSearchService.js";
import { callGroqAPI } from "./services/llmService.js";
import { processRAGQuery } from "./utils/ragOrchestrator.js";

// Test 1: Knowledge Base Search
export const testKnowledgeBase = () => {
  console.log("🧪 Test 1: Knowledge Base Search");
  console.log("================================");

  const testQueries = ["diversification", "risque", "actions", "débutant"];

  testQueries.forEach((query) => {
    const results = searchKnowledge(query, 2);
    console.log(`\nQuery: "${query}"`);
    console.log(`Results: ${results.length}`);
    if (results.length > 0) {
      console.log(
        `Top match: ${results[0].topic} (score: ${results[0].score})`
      );
    }
  });

  console.log("\n✅ Knowledge Base test completed\n");
};

// Test 2: Web Search
export const testWebSearch = async () => {
  console.log("🧪 Test 2: Web Search");
  console.log("=====================");

  try {
    // Test general search
    console.log("\nTesting general search...");
    const result1 = await webSearch("investissement");
    console.log(`Success: ${result1.success}`);
    console.log(`Sources: ${result1.sources?.length || 0}`);

    // Test market data
    console.log("\nTesting market data...");
    const result2 = await webSearch("cours AAPL", "market");
    console.log(`Success: ${result2.success}`);
    if (result2.success) {
      console.log(`Data:`, result2.sources[0]?.summary);
    }

    console.log("\n✅ Web Search test completed\n");
  } catch (error) {
    console.error("❌ Web Search test failed:", error.message);
  }
};

// Test 3: LLM API
export const testLLMAPI = async () => {
  console.log("🧪 Test 3: LLM API Connection");
  console.log("=============================");

  try {
    const messages = [
      {
        role: "system",
        content:
          "Tu es un assistant financier. Réponds en français en une phrase.",
      },
      {
        role: "user",
        content: "Qu'est-ce que la diversification?",
      },
    ];

    console.log("\nCalling Groq API...");
    const response = await callGroqAPI(messages, "mixtral-8x7b-32768");

    console.log(`Success: ${response.success}`);
    console.log(`Model: ${response.model}`);
    console.log(`Response: ${response.message.substring(0, 100)}...`);
    console.log(`Tokens used: ${response.usage?.total_tokens || "N/A"}`);

    console.log("\n✅ LLM API test completed\n");
  } catch (error) {
    console.error("❌ LLM API test failed:", error.message);
    console.error("💡 Make sure VITE_GROQ_API_KEY is set in .env file");
    console.error("💡 Get free key at: https://console.groq.com/keys");
  }
};

// Test 4: Full RAG Pipeline
export const testRAGPipeline = async () => {
  console.log("🧪 Test 4: Full RAG Pipeline");
  console.log("============================");

  try {
    const testQuery = "Comment diversifier mon portefeuille?";
    const userProfile = {
      balance: 50000,
      investmentCount: 2,
      totalInvested: 30000,
      performance: 5.5,
    };

    console.log(`\nQuery: "${testQuery}"`);
    console.log("Processing...");

    const result = await processRAGQuery(testQuery, userProfile);

    console.log(`\nSuccess: ${result.success}`);
    console.log(`Response length: ${result.response.length} characters`);
    console.log(`Processing time: ${result.processingTime}ms`);
    console.log(`\nSources used:`);
    console.log(
      `  - Knowledge Base: ${result.sources.knowledgeBase} (${result.sources.knowledgeCount} entries)`
    );
    console.log(
      `  - Web Search: ${result.sources.webSearch} (${result.sources.webSources} sources)`
    );
    console.log(`\nResponse preview:`);
    console.log(result.response.substring(0, 200) + "...");

    console.log("\n✅ RAG Pipeline test completed\n");
  } catch (error) {
    console.error("❌ RAG Pipeline test failed:", error.message);
  }
};

// Test 5: Performance Benchmark
export const benchmarkPerformance = async () => {
  console.log("🧪 Test 5: Performance Benchmark");
  console.log("=================================");

  const queries = [
    "Mon solde",
    "Conseils diversification",
    "Actualités marché aujourd'hui",
  ];

  const userProfile = {
    balance: 25000,
    investmentCount: 3,
    totalInvested: 15000,
    performance: 3.2,
  };

  for (const query of queries) {
    try {
      console.log(`\nTesting: "${query}"`);
      const startTime = Date.now();
      const result = await processRAGQuery(query, userProfile);
      const endTime = Date.now();

      console.log(`  ✓ Time: ${endTime - startTime}ms`);
      console.log(
        `  ✓ Sources: KB=${result.sources.knowledgeBase}, Web=${result.sources.webSearch}`
      );
      console.log(`  ✓ Response: ${result.response.substring(0, 80)}...`);
    } catch (error) {
      console.log(`  ✗ Failed: ${error.message}`);
    }
  }

  console.log("\n✅ Performance benchmark completed\n");
};

// Run all tests
export const runAllTests = async () => {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 Tawfir AI Assistant - Test Suite");
  console.log("=".repeat(50) + "\n");

  try {
    // Test 1: Knowledge Base (synchronous)
    testKnowledgeBase();

    // Test 2: Web Search (async)
    await testWebSearch();

    // Test 3: LLM API (async)
    await testLLMAPI();

    // Test 4: Full RAG Pipeline (async)
    await testRAGPipeline();

    // Test 5: Performance (async)
    await benchmarkPerformance();

    console.log("\n" + "=".repeat(50));
    console.log("✅ All tests completed!");
    console.log("=".repeat(50) + "\n");

    return true;
  } catch (error) {
    console.error("\n❌ Test suite failed:", error);
    return false;
  }
};

// Export for use in browser console
if (typeof window !== "undefined") {
  window.testAIAssistant = {
    testKnowledgeBase,
    testWebSearch,
    testLLMAPI,
    testRAGPipeline,
    benchmarkPerformance,
    runAllTests,
  };

  console.log("🧪 AI Assistant tests loaded!");
  console.log("Run: window.testAIAssistant.runAllTests()");
}

export default {
  testKnowledgeBase,
  testWebSearch,
  testLLMAPI,
  testRAGPipeline,
  benchmarkPerformance,
  runAllTests,
};
