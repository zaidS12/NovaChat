/**
 * NovaChat AI API Integration
 * 
 * Dual API system that uses both Gemini and OpenAI APIs,
 * compares responses, and selects the best one based on quality metrics.
 * 
 * @author NovaChat Team
 * @version 1.0.0
 */

// ==================== API CONFIGURATION ====================

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyB4FaSkPtkBWlhobXUQb_KpAtvlzRK44No';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// OpenAI API Configuration
const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// ==================== RESPONSE QUALITY METRICS ====================

/**
 * Score a response based on various quality metrics
 * @param {string} response - The AI response to score
 * @param {string} userMessage - The original user message
 * @returns {Object} Quality score and metrics
 */
const scoreResponse = (response, userMessage) => {
  let score = 0;
  const metrics = {
    length: 0,
    relevance: 0,
    helpfulness: 0,
    clarity: 0,
    completeness: 0
  };

  // Length score (optimal range: 50-500 characters)
  const length = response.length;
  if (length >= 50 && length <= 500) {
    metrics.length = 1;
  } else if (length > 500) {
    metrics.length = 0.8; // Slightly penalize very long responses
  } else {
    metrics.length = 0.5; // Penalize very short responses
  }

  // Relevance score (check for keyword matches)
  const userKeywords = userMessage.toLowerCase().split(' ').filter(word => word.length > 3);
  const responseWords = response.toLowerCase().split(' ');
  const keywordMatches = userKeywords.filter(keyword => 
    responseWords.some(word => word.includes(keyword))
  ).length;
  metrics.relevance = Math.min(keywordMatches / userKeywords.length, 1);

  // Helpfulness score (check for action words and solutions)
  const helpfulWords = ['help', 'solution', 'suggest', 'recommend', 'try', 'use', 'how', 'what', 'why', 'when', 'where'];
  const helpfulCount = helpfulWords.filter(word => 
    response.toLowerCase().includes(word)
  ).length;
  metrics.helpfulness = Math.min(helpfulCount / 5, 1);

  // Clarity score (check for proper sentence structure)
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
  metrics.clarity = avgSentenceLength >= 5 && avgSentenceLength <= 25 ? 1 : 0.7;

  // Completeness score (check for question answering)
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which'];
  const hasQuestion = questionWords.some(word => userMessage.toLowerCase().includes(word));
  if (hasQuestion) {
    // Check if response addresses the question
    const responseSentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const questionAnswered = responseSentences.some(sentence => 
      sentence.toLowerCase().includes('answer') || 
      sentence.toLowerCase().includes('explain') ||
      sentence.toLowerCase().includes('because') ||
      sentence.toLowerCase().includes('is') ||
      sentence.toLowerCase().includes('are')
    );
    metrics.completeness = questionAnswered ? 1 : 0.5;
  } else {
    metrics.completeness = 1; // Not a question, so completeness is based on general helpfulness
  }

  // Calculate overall score
  score = (metrics.length * 0.2 + metrics.relevance * 0.3 + metrics.helpfulness * 0.25 + 
           metrics.clarity * 0.15 + metrics.completeness * 0.1);

  return { score, metrics };
};

// ==================== GEMINI API FUNCTIONS ====================

/**
 * Generate response using Gemini API
 * @param {Array} messages - Conversation history
 * @returns {Promise<Object>} Response object with text and metadata
 */
const generateGeminiResponse = async (messages) => {
  try {
    console.log('🚀 Sending request to Gemini API...');
    
    // Convert message history to Gemini API format
    const contents = messages
      .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{
          text: msg.content
        }]
      }));
    
    const requestBody = {
      contents: contents,
      systemInstruction: {
        parts: [{
          text: "You are NovaChat Assistant, a helpful AI chatbot. Provide clear, concise, and helpful responses. Always maintain context from the previous messages in our conversation."
        }]
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };
    
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const responseText = data.candidates[0].content.parts[0].text;
      return {
        text: responseText,
        provider: 'gemini',
        success: true,
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    return {
      text: 'I apologize, but I\'m having trouble processing your request right now.',
      provider: 'gemini',
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// ==================== OPENAI API FUNCTIONS ====================

/**
 * Generate response using OpenAI API
 * @param {Array} messages - Conversation history
 * @returns {Promise<Object>} Response object with text and metadata
 */
const generateOpenAIResponse = async (messages) => {
  try {
    console.log('🚀 Sending request to OpenAI API...');
    
    // Convert message history to OpenAI API format
    const openaiMessages = messages
      .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    // Add system message
    openaiMessages.unshift({
      role: 'system',
      content: 'You are NovaChat Assistant, a helpful AI chatbot. Provide clear, concise, and helpful responses. Always maintain context from the previous messages in our conversation.'
    });
    
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0
    };
    
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const responseText = data.choices[0].message.content;
      return {
        text: responseText,
        provider: 'openai',
        success: true,
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error('Invalid response format from OpenAI API');
    }
  } catch (error) {
    console.error('❌ OpenAI API Error:', error);
    return {
      text: 'I apologize, but I\'m having trouble processing your request right now.',
      provider: 'openai',
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// ==================== DUAL API FUNCTIONS ====================

/**
 * Generate response using both APIs and select the best one
 * @param {Array} messages - Conversation history
 * @returns {Promise<Object>} Best response with comparison data
 */
export const generateBestResponse = async (messages) => {
  try {
    console.log('🔄 Generating responses from both APIs...');
    
    // Get the latest user message for scoring
    const latestUserMessage = messages.filter(msg => msg.sender === 'user').pop()?.content || '';
    
    // Call both APIs in parallel
    const [geminiResponse, openaiResponse] = await Promise.allSettled([
      generateGeminiResponse(messages),
      generateOpenAIResponse(messages)
    ]);
    
    const responses = [];
    
    // Process Gemini response
    if (geminiResponse.status === 'fulfilled' && geminiResponse.value.success) {
      const geminiScore = scoreResponse(geminiResponse.value.text, latestUserMessage);
      responses.push({
        ...geminiResponse.value,
        qualityScore: geminiScore.score,
        qualityMetrics: geminiScore.metrics
      });
    }
    
    // Process OpenAI response
    if (openaiResponse.status === 'fulfilled' && openaiResponse.value.success) {
      const openaiScore = scoreResponse(openaiResponse.value.text, latestUserMessage);
      responses.push({
        ...openaiResponse.value,
        qualityScore: openaiScore.score,
        qualityMetrics: openaiScore.metrics
      });
    }
    
    // If no successful responses, return fallback
    if (responses.length === 0) {
      return {
        text: 'I apologize, but I\'m having trouble processing your request right now. Please try again later.',
        provider: 'fallback',
        success: false,
        timestamp: new Date().toISOString(),
        comparison: {
          geminiSuccess: geminiResponse.status === 'fulfilled' && geminiResponse.value.success,
          openaiSuccess: openaiResponse.status === 'fulfilled' && openaiResponse.value.success,
          error: 'Both APIs failed'
        }
      };
    }
    
    // Select the best response based on quality score
    const bestResponse = responses.reduce((best, current) => 
      current.qualityScore > best.qualityScore ? current : best
    );
    
    // Prepare comparison data
    const comparison = {
      totalResponses: responses.length,
      geminiSuccess: geminiResponse.status === 'fulfilled' && geminiResponse.value.success,
      openaiSuccess: openaiResponse.status === 'fulfilled' && openaiResponse.value.success,
      selectedProvider: bestResponse.provider,
      qualityScores: responses.map(r => ({
        provider: r.provider,
        score: r.qualityScore,
        metrics: r.qualityMetrics
      }))
    };
    
    console.log('✅ Best response selected:', {
      provider: bestResponse.provider,
      score: bestResponse.qualityScore,
      comparison
    });
    
    return {
      ...bestResponse,
      comparison,
      success: true
    };
    
  } catch (error) {
    console.error('💥 Error in dual API system:', error);
    return {
      text: 'I apologize, but I\'m having trouble processing your request right now.',
      provider: 'fallback',
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Generate response using only Gemini API (fallback)
 * @param {Array} messages - Conversation history
 * @returns {Promise<string>} Response text
 */
export const generateGeminiResponseOnly = async (messages) => {
  const response = await generateGeminiResponse(messages);
  return response.text;
};

/**
 * Generate response using only OpenAI API (fallback)
 * @param {Array} messages - Conversation history
 * @returns {Promise<string>} Response text
 */
export const generateOpenAIResponseOnly = async (messages) => {
  const response = await generateOpenAIResponse(messages);
  return response.text;
};

/**
 * Test both APIs and return comparison data
 * @param {Array} messages - Conversation history
 * @returns {Promise<Object>} Comparison data
 */
export const testBothAPIs = async (messages) => {
  console.log('🧪 Testing both APIs...');
  
  const [geminiResponse, openaiResponse] = await Promise.allSettled([
    generateGeminiResponse(messages),
    generateOpenAIResponse(messages)
  ]);
  
  return {
    gemini: {
      success: geminiResponse.status === 'fulfilled' && geminiResponse.value.success,
      response: geminiResponse.status === 'fulfilled' ? geminiResponse.value : null,
      error: geminiResponse.status === 'rejected' ? geminiResponse.reason : null
    },
    openai: {
      success: openaiResponse.status === 'fulfilled' && openaiResponse.value.success,
      response: openaiResponse.status === 'fulfilled' ? openaiResponse.value : null,
      error: openaiResponse.status === 'rejected' ? openaiResponse.reason : null
    },
    timestamp: new Date().toISOString()
  };
};

// ==================== CONFIGURATION FUNCTIONS ====================

/**
 * Set OpenAI API key
 * @param {string} apiKey - OpenAI API key
 */
export const setOpenAIAPIKey = (apiKey) => {
  OPENAI_API_KEY = apiKey;
};

/**
 * Get current API configuration
 * @returns {Object} API configuration
 */
export const getAPIConfig = () => {
  return {
    gemini: {
      configured: !!GEMINI_API_KEY,
      url: GEMINI_API_URL
    },
    openai: {
      configured: !!OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here',
      url: OPENAI_API_URL
    }
  };
};

// Export default function for backward compatibility
export default generateBestResponse;
