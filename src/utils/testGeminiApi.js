// Test script to verify Gemini API is working
import { generateGeminiResponse } from './geminiApi.js'

// Test function to check API connectivity
export const testGeminiAPI = async () => {
  console.log('Testing Gemini API...')
  
  try {
    const testMessages = [{
      id: 1,
      content: 'Hello, can you respond with a simple greeting?',
      sender: 'user',
      timestamp: new Date()
    }]
    console.log('Sending test messages:', testMessages)
    
    const response = await generateGeminiResponse(testMessages)
    console.log('✅ Gemini API Response:', response)
    
    return {
      success: true,
      response: response,
      message: 'API is working correctly'
    }
  } catch (error) {
    console.error('❌ Gemini API Error:', error)
    
    return {
      success: false,
      error: error.message,
      message: 'API test failed'
    }
  }
}

// Auto-run test when this module is imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  window.testGeminiAPI = testGeminiAPI
  console.log('Gemini API test function available as window.testGeminiAPI()')
}