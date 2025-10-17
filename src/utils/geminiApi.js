// Gemini API Integration
const GEMINI_API_KEY = 'AIzaSyB4FaSkPtkBWlhobXUQb_KpAtvlzRK44No'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export const generateGeminiResponse = async (messages) => {
  try {
    console.log('🚀 Sending request to Gemini API with conversation history:', messages)
    
    // Convert message history to Gemini API format
    const contents = messages
      .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{
          text: msg.content
        }]
      }))
    
    const requestBody = {
      contents: contents,
      systemInstruction: {
        parts: [{
          text: "You are NovaChat Assistant, a helpful AI chatbot. Always maintain context from the previous messages in our conversation. When responding, consider the entire conversation history and provide relevant, contextual responses that build upon what has been discussed. Stay consistent with the topic and previous responses unless the user explicitly changes the subject."
        }]
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    }
    
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ HTTP Error Response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const responseText = data.candidates[0].content.parts[0].text
      return responseText
    } else {
      console.error('❌ Invalid response format:', data)
      throw new Error('Invalid response format from Gemini API')
    }
  } catch (error) {
    console.error('💥 Error calling Gemini API:', error)
    console.error('💥 Error stack:', error.stack)
    return 'I apologize, but I\'m having trouble processing your request right now. Please try again later.'
  }
}

export default { generateGeminiResponse }