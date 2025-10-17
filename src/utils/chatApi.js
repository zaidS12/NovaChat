// Chat API utilities for saving and retrieving messages

const API_BASE_URL = '/api/chat';

// Save message to database
export const saveMessage = async (messageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/save_message.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(messageData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save message');
    }
    
    return data;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

// Get messages for a chat
export const getMessages = async (userId, chatId, limit = 50, offset = 0) => {
  try {
    const params = new URLSearchParams({
      user_id: userId,
      chat_id: chatId,
      limit: limit.toString(),
      offset: offset.toString()
    });

    const response = await fetch(`${API_BASE_URL}/get_messages.php?${params}`, {
      method: 'GET',
      credentials: 'include'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get messages');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

// Get user's chats
export const getChats = async (userId) => {
  try {
    const params = new URLSearchParams({
      user_id: userId
    });

    const response = await fetch(`${API_BASE_URL}/get_chats.php?${params}`, {
      method: 'GET',
      credentials: 'include'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get chats');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting chats:', error);
    throw error;
  }
};

// Get current user ID from localStorage or context
export const getCurrentUserId = () => {
  // Try to get from localStorage first
  const storedUser = localStorage.getItem('user_data') || localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return user.id;
    } catch (error) {
      console.error('Error parsing stored user:', error);
    }
  }
  
  // Default to 1 if no user is logged in (for testing)
  return 1;
};

// Get current chat ID from localStorage or create new one
export const getCurrentChatId = () => {
  // Try to get from localStorage first
  const storedChatId = localStorage.getItem('currentChatId');
  if (storedChatId) {
    return parseInt(storedChatId);
  }
  
  // Create a new chat ID (this will be handled by the API)
  return null;
};

// Set current chat ID in localStorage
export const setCurrentChatId = (chatId) => {
  localStorage.setItem('currentChatId', chatId.toString());
};
