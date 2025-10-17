import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Search,
  Phone,
  Video,
  Info,
  Copy,
  Heart,
  Pin,
  ArrowLeft,
  Menu,
  X,
  MessageCircle,
  Camera,
  Plus,
  Users,
  RotateCcw,
  Archive,
  User,
  Settings
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'
import ThemeToggle from '../components/ui/ThemeToggle'
import MarkdownRenderer from '../components/ui/MarkdownRenderer'
import TypingMessage from '../components/ui/TypingMessage'
import ImageUpload from '../components/ui/ImageUpload'
import ImageMessage from '../components/ui/ImageMessage'
import AIConfigModal from '../components/ui/AIConfigModal'
import { generateBestResponse, generateGeminiResponseOnly, testBothAPIs } from '../utils/aiApi'
import { saveMessage, getMessages, getCurrentUserId, getCurrentChatId, setCurrentChatId } from '../utils/chatApi'

// WhatsApp Page Components
import WhatsAppChatsPage from '../components/whatsapp/WhatsAppChatsPage'
import WhatsAppIndividualChatPage from '../components/whatsapp/WhatsAppIndividualChatPage'
import WhatsAppContactInfoPage from '../components/whatsapp/WhatsAppContactInfoPage'
import WhatsAppEditContactPage from '../components/whatsapp/WhatsAppEditContactPage'
import WhatsAppStatusPage from '../components/whatsapp/WhatsAppStatusPage'
import WhatsAppCameraPage from '../components/whatsapp/WhatsAppCameraPage'
import WhatsAppCallsPage from '../components/whatsapp/WhatsAppCallsPage'
import WhatsAppSettingsPage from '../components/whatsapp/WhatsAppSettingsPage'

const Chatbot = () => {
  // Original Chatbot State
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingMessages, setTypingMessages] = useState(new Set())
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [showAIConfig, setShowAIConfig] = useState(false)
  const [currentChatId, setCurrentChatIdState] = useState(null)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  
  // WhatsApp Interface State
  const [whatsappSelectedChat, setWhatsappSelectedChat] = useState(null)
  const [whatsappActiveTab, setWhatsappActiveTab] = useState('chats')
  const [whatsappSearchQuery, setWhatsappSearchQuery] = useState('')
  const [whatsappFilter, setWhatsappFilter] = useState('all')
  const [whatsappMessage, setWhatsappMessage] = useState('')
  const [whatsappMessages, setWhatsappMessages] = useState([
    {
      id: 1,
      content: 'Hey! This is the WhatsApp interface. How can I help you?',
      sender: 'bot',
      timestamp: new Date(),
      typing: false
    }
  ])
  const [whatsappIsTyping, setWhatsappIsTyping] = useState(false)
  
  // WhatsApp Page Navigation
  const [whatsappCurrentPage, setWhatsappCurrentPage] = useState('chats') // chats, individual-chat, contact-info, edit-contact, status, camera, calls, settings, etc.
  const [whatsappEditMode, setWhatsappEditMode] = useState(false)
  const [whatsappSelectedItems, setWhatsappSelectedItems] = useState([])
  
  // WhatsApp Modal States
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showCallModal, setShowCallModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showChatActionsModal, setShowChatActionsModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  
  // Shared State
  const [selectedChat, setSelectedChat] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [conversations, setConversations] = useState([])
  const [isLoadingChats, setIsLoadingChats] = useState(false)
  const messagesEndRef = useRef(null)
  const whatsappMessagesEndRef = useRef(null)
  const messageInputRef = useRef(null)
  
  const whatsappChats = [
    {
      id: 1,
      name: 'Andrew Parker',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      lastMessage: 'What kind of strategy is better?',
      timestamp: '11/19/19',
      unread: 0,
      online: false,
      pinned: false,
      type: 'individual',
      verified: false
    },
    {
      id: 2,
      name: 'Karen Castillo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      lastMessage: '0:14',
      timestamp: '11/16/19',
      unread: 1,
      online: false,
      pinned: false,
      type: 'individual',
      verified: false
    },
    {
      id: 3,
      name: 'Maximillian Jacobson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      lastMessage: 'Photo',
      timestamp: '11/15/19',
      unread: 0,
      online: false,
      pinned: false,
      type: 'individual',
      verified: false
    },
    {
      id: 4,
      name: 'Martin Randolph',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      lastMessage: 'Thanks for the quick response!',
      timestamp: '11/14/19',
      unread: 2,
      online: false,
      pinned: false,
      type: 'individual',
      verified: false
    },
    {
      id: 5,
      name: 'Martha Craig',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
      lastMessage: 'Do you like it?',
      timestamp: '11/13/19',
      unread: 0,
      online: false,
      pinned: false,
      type: 'individual',
      verified: false
    }
  ]

  // WhatsApp Calls Data
  const whatsappCalls = [
    {
      id: 1,
      name: 'Martin Randolph',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      type: 'outgoing',
      timestamp: '10/13/19',
      duration: '2:34'
    },
    {
      id: 2,
      name: 'Karen Castillo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      type: 'missed',
      timestamp: '10/11/19',
      duration: '0:00'
    },
    {
      id: 3,
      name: 'Andrew Parker',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      type: 'incoming',
      timestamp: '10/10/19',
      duration: '1:45'
    }
  ]

  // WhatsApp Status Data
  const whatsappStatusUpdates = [
    {
      id: 1,
      name: 'My Status',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      time: 'Add to my status',
      isOwn: true
    },
    {
      id: 2,
      name: 'Andrew Parker',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      time: '2 minutes ago',
      isOwn: false
    },
    {
      id: 3,
      name: 'Karen Castillo',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      time: '1 hour ago',
      isOwn: false
    }
  ]

  // WhatsApp Settings Data
  const whatsappSettings = [
    { id: 'starred', title: 'Starred Messages', icon: '⭐' },
    { id: 'web', title: 'WhatsApp Web/Desktop', icon: '💻' },
    { id: 'account', title: 'Account', icon: '👤' },
    { id: 'chats', title: 'Chats', icon: '💬' },
    { id: 'notifications', title: 'Notifications', icon: '🔔' },
    { id: 'data', title: 'Data and Storage Usage', icon: '📊' },
    { id: 'help', title: 'Help', icon: '❓' },
    { id: 'tell', title: 'Tell a Friend', icon: '📤' }
  ]
  
  const suggestedPrompts = [
    'How do I reset my password?',
    'Tell me about your features',
    'I need technical support',
    'Show me the pricing plans'
  ]
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  const scrollWhatsappToBottom = () => {
    whatsappMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  useEffect(() => {
    scrollWhatsappToBottom()
  }, [whatsappMessages])
  
  // Test Gemini API on component mount
  useEffect(() => {
    const runAPITest = async () => {
      console.log('🔍 Running Gemini API connectivity test...')
      const result = await testGeminiAPI()
      if (result.success) {
        console.log('✅ Gemini API is working properly!')
      } else {
        console.error('❌ Gemini API test failed:', result.error)
      }
    }
    runAPITest()

    // Load conversations and messages from database
    loadConversations()
    loadMessages()
  }, [])
  
  const handleTypingComplete = (messageId) => {
    setTypingMessages(prev => {
      const newSet = new Set(prev)
      newSet.delete(messageId)
      return newSet
    })
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, typing: false } : msg
    ))
  }

  const handleImageSelect = async (imageData) => {
    const imageMessage = {
      id: messages.length + 1,
      content: '',
      image: imageData,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, imageMessage])
    setShowImageUpload(false)

    // Save image message to database
    try {
      const userId = getCurrentUserId()
      await saveMessage({
        user_id: userId,
        chat_id: currentChatId,
        message: '',
        message_type: 'image',
        is_bot: false,
        attachment_url: imageData,
        attachment_name: 'image.jpg',
        attachment_size: imageData.length
      })
    } catch (error) {
      console.error('Failed to save image message:', error)
    }
  }

  const loadMessages = async () => {
    try {
      setIsLoadingMessages(true)
      const userId = getCurrentUserId()
      const chatId = getCurrentChatId() || currentChatId
      
      if (chatId) {
        const response = await getMessages(userId, chatId)
        if (response.success) {
          const formattedMessages = response.data.messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            image: msg.attachment_url,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp),
            read: msg.read
          }))
          setMessages(formattedMessages)
        }
      } else {
        // If no chat ID, clear messages for new chat
        setMessages([])
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const loadConversations = async () => {
    try {
      setIsLoadingChats(true)
      const userId = getCurrentUserId()
      const response = await getChats(userId)
      
      if (response.success) {
        const formattedChats = response.data.chats.map(chat => ({
          id: chat.id,
          name: chat.title,
          avatar: chat.avatar,
          lastMessage: chat.lastMessage,
          timestamp: chat.timestamp,
          unread: chat.unread,
          online: true // You can implement online status logic here
        }))
        setConversations(formattedChats)
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setIsLoadingChats(false)
    }
  }

  const saveMessageToDatabase = async (messageContent, isBot = false, messageType = 'text', attachmentData = null) => {
    try {
      const userId = getCurrentUserId()
      let chatId = currentChatId || getCurrentChatId()
      
      // If no chat ID, create a new chat by saving the message
      const messageData = {
        user_id: userId,
        chat_id: chatId,
        message: messageContent,
        message_type: messageType,
        is_bot: isBot
      }
      
      if (attachmentData) {
        messageData.attachment_url = attachmentData
        messageData.attachment_name = 'image.jpg'
        messageData.attachment_size = attachmentData.length
      }
      
      const response = await saveMessage(messageData)
      
      // If this was a new chat, update the current chat ID
      if (response.success && response.data.chat_id !== chatId) {
        setCurrentChatIdState(response.data.chat_id)
        setCurrentChatId(response.data.chat_id)
        // Set the selected chat to the new chat
        setSelectedChat(response.data.chat_id)
        // Refresh conversations list to show the new chat
        loadConversations()
      }
      
      return response
    } catch (error) {
      console.error('Failed to save message to database:', error)
      throw error
    }
  }
  
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    
    // Process user message for better formatting
    const processedMessage = message
      .replace(/\s+/g, ' ') // Remove multiple spaces
      .replace(/\s+([.!?,:;])/g, '$1') // Remove space before punctuation
      .replace(/([.!?])\s*([a-z])/g, '$1 $2') // Add space after sentence endings
      .trim()
    
    const newMessage = {
      id: messages.length + 1,
      content: processedMessage,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    setMessage('')
    setIsTyping(true)
    
    // Save user message to database
    try {
      await saveMessageToDatabase(processedMessage, false, 'text')
    } catch (error) {
      console.error('Failed to save user message:', error)
    }
    
    // Get response from AI API (dual system)
    try {
      // Include the new user message in the conversation history
      const conversationHistory = [...messages, newMessage]
      const aiResponse = await generateBestResponse(conversationHistory)
      
      // Ensure the response is a valid string
      if (!aiResponse.text || typeof aiResponse.text !== 'string') {
        console.error('Invalid AI response:', aiResponse)
        throw new Error('Invalid response from API')
      }
      
      const botResponse = {
        id: messages.length + 2,
        content: aiResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        typing: true,
        provider: aiResponse.provider,
        qualityScore: aiResponse.qualityScore,
        comparison: aiResponse.comparison
      }
      setMessages(prev => [...prev, botResponse])
      setTypingMessages(prev => new Set([...prev, botResponse.id]))
      
      // Save bot response to database
      try {
        await saveMessageToDatabase(botResponseText, true, 'text')
      } catch (error) {
        console.error('Failed to save bot message:', error)
      }
    } catch (error) {
      console.error('Error getting bot response:', error)
      const errorResponse = {
        id: messages.length + 2,
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
        typing: true
      }
      setMessages(prev => [...prev, errorResponse])
      setTypingMessages(prev => new Set([...prev, errorResponse.id]))
      
      // Save error response to database
      try {
        await saveMessageToDatabase(errorResponse.content, true, 'text')
      } catch (error) {
        console.error('Failed to save error message:', error)
      }
    } finally {
      setIsTyping(false)
    }
  }
  
  const handlePromptClick = (prompt) => {
    setMessage(prompt)
  }

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId)
    setCurrentChatIdState(chatId)
    setCurrentChatId(chatId)
    loadMessages()
  }

  const handleNewChat = async () => {
    console.log('🔄 Starting new chat...')
    try {
      // Clear current chat state
      setSelectedChat(null)
      setCurrentChatIdState(null)
      setCurrentChatId(null)
      setMessages([])
      
      // Clear any existing chat ID from storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentChatId')
      }
      
      // Create a new chat by sending a welcome message
      const welcomeMessage = "Hello! I'm here to help you. How can I assist you today?"
      
      // Add welcome message to UI immediately
      const welcomeMsg = {
        id: Date.now(),
        content: welcomeMessage,
        sender: 'bot',
        timestamp: new Date(),
        typing: true
      }
      setMessages([welcomeMsg])
      console.log('✅ Welcome message added to UI')
      
      // Create new chat in database by saving the welcome message
      try {
        const userId = getCurrentUserId()
        console.log('👤 User ID:', userId)
        
        const response = await saveMessage({
          user_id: userId,
          chat_id: null, // This will create a new chat
          message: welcomeMessage,
          message_type: 'text',
          is_bot: true
        })
        
        console.log('💾 Save message response:', response)
        
        if (response.success) {
          // Update chat ID state
          const newChatId = response.data.chat_id
          setCurrentChatIdState(newChatId)
          setCurrentChatId(newChatId)
          setSelectedChat(newChatId)
          
          console.log('✅ New chat created with ID:', newChatId)
          
          // Refresh conversations list to show the new chat
          loadConversations()
          
          // Focus on message input after a short delay
          setTimeout(() => {
            if (messageInputRef.current) {
              messageInputRef.current.focus()
              console.log('🎯 Focused on message input')
            }
          }, 100)
        }
      } catch (error) {
        console.error('❌ Failed to create new chat:', error)
        // Still focus on input even if database save fails
        setTimeout(() => {
          if (messageInputRef.current) {
            messageInputRef.current.focus()
            console.log('🎯 Focused on message input (fallback)')
          }
        }, 100)
      }
    } catch (error) {
      console.error('❌ Error creating new chat:', error)
    }
  }
  
  const handleWhatsappPromptClick = (prompt) => {
    setWhatsappMessage(prompt)
  }
  
  // WhatsApp Interface Handlers
  const handleWhatsappCamera = () => {
    setWhatsappCurrentPage('camera')
  }
  
  const handleWhatsappSearch = () => {
    setShowSearchModal(true)
  }
  
  const handleWhatsappMenu = () => {
    setShowMenuModal(true)
  }
  
  const handleWhatsappNewChat = () => {
    setShowNewChatModal(true)
  }
  
  const handleWhatsappTabChange = (tabId) => {
    setWhatsappActiveTab(tabId)
    if (tabId === 'updates') {
      setWhatsappCurrentPage('status')
    } else if (tabId === 'calls') {
      setWhatsappCurrentPage('calls')
    } else if (tabId === 'settings') {
      setWhatsappCurrentPage('settings')
    } else if (tabId === 'chats') {
      setWhatsappCurrentPage('chats')
    }
  }
  
  const handleWhatsappBack = () => {
    if (whatsappCurrentPage === 'individual-chat') {
      setWhatsappCurrentPage('chats')
    } else if (whatsappCurrentPage === 'contact-info') {
      setWhatsappCurrentPage('individual-chat')
    } else if (whatsappCurrentPage === 'edit-contact') {
      setWhatsappCurrentPage('contact-info')
    } else {
      setWhatsappCurrentPage('chats')
    }
  }
  
  const handleWhatsappPageChange = (page) => {
    setWhatsappCurrentPage(page)
  }
  
  const handleWhatsappEditMode = () => {
    setWhatsappEditMode(!whatsappEditMode)
    setWhatsappSelectedItems([])
  }
  
  const handleWhatsappItemSelect = (itemId) => {
    if (whatsappSelectedItems.includes(itemId)) {
      setWhatsappSelectedItems(whatsappSelectedItems.filter(id => id !== itemId))
    } else {
      setWhatsappSelectedItems([...whatsappSelectedItems, itemId])
    }
  }
  
  const handleWhatsappSendMessage = async (e) => {
    e.preventDefault()
    if (!whatsappMessage.trim()) return
    
    const newMessage = {
      id: whatsappMessages.length + 1,
      content: whatsappMessage,
      sender: 'user',
      timestamp: new Date()
    }
    
    setWhatsappMessages(prev => [...prev, newMessage])
    setWhatsappMessage('')
    setWhatsappIsTyping(true)
    
    // Get response from AI API (dual system) for WhatsApp interface
    try {
      const conversationHistory = [...whatsappMessages, newMessage]
      const aiResponse = await generateBestResponse(conversationHistory)
      const botResponse = {
        id: whatsappMessages.length + 2,
        content: aiResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        typing: true,
        provider: aiResponse.provider,
        qualityScore: aiResponse.qualityScore,
        comparison: aiResponse.comparison
      }
      setWhatsappMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error getting WhatsApp bot response:', error)
      const errorResponse = {
        id: whatsappMessages.length + 2,
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
        typing: true
      }
      setWhatsappMessages(prev => [...prev, errorResponse])
    } finally {
      setWhatsappIsTyping(false)
    }
  }
  
  const TypingIndicator = () => (
    <motion.div
      className="flex items-center space-x-1 p-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-slate-400 rounded-full"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </motion.div>
  )
  
  return (
    <div className="page-background chatbot-bg h-screen flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-12 right-28 w-38 h-38 bg-fuchsia-200/15 dark:bg-fuchsia-500/10 rounded-full blur-3xl"
        animate={{ 
          y: [0, -38, 0],
          x: [0, 28, 0],
          scale: [1, 1.28, 1],
          rotate: [0, 200, 360]
        }}
        transition={{ 
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-2/5 left-8 w-24 h-24 bg-emerald-200/15 dark:bg-emerald-500/10 rounded-full blur-2xl"
        animate={{ 
          y: [0, 26, 0],
          x: [0, -16, 0],
          scale: [1, 0.8, 1]
        }}
        transition={{ 
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3.5
        }}
      />
      <motion.div 
        className="absolute bottom-24 right-1/8 w-26 h-26 bg-orange-200/15 dark:bg-orange-500/10 rounded-full blur-xl"
        animate={{ 
          y: [0, -24, 0],
          rotate: [0, 360, 0]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute top-4/5 right-12 w-18 h-18 bg-red-200/15 dark:bg-red-500/10 rounded-full blur-lg"
        animate={{ 
          y: [0, 16, 0],
          x: [0, 10, 0],
          scale: [1, 1.18, 1]
        }}
        transition={{ 
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6
        }}
      />
      <motion.div 
        className="absolute bottom-2/5 left-2/5 w-34 h-34 bg-blue-200/15 dark:bg-blue-500/10 rounded-full blur-2xl"
        animate={{ 
          y: [0, -32, 0],
          x: [0, 32, 0],
          rotate: [0, 150, 300, 360]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      {/* Chat List Sidebar */}
      <motion.div 
        className={`${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full transition-all duration-300 ease-in-out`}
        initial={false}
        animate={{ width: sidebarCollapsed ? 64 : 320 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
              </Button>
              {!sidebarCollapsed && (
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Chats</h2>
              )}
            </div>
            {!sidebarCollapsed && <ThemeToggle className="shrink-0" />}
          </div>
          {!sidebarCollapsed && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          )}
        </div>
        
        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingChats ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={24} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No conversations yet</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Start a new chat to begin</p>
              <Button onClick={handleNewChat} className="w-full">
                Start New Chat
              </Button>
            </div>
          ) : (
            conversations.map((chat, index) => (
            <motion.div
              key={chat.id}
              className={`${sidebarCollapsed ? 'p-2 justify-center' : 'p-4'} border-b border-slate-100 dark:border-slate-700 cursor-pointer transition-colors ${
                  selectedChat === chat.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-r-blue-500' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
                onClick={() => handleChatSelect(chat.id)}
              whileHover={{ x: sidebarCollapsed ? 0 : 2 }}
              transition={{ duration: 0.2 }}
              title={sidebarCollapsed ? chat.name : ''}
            >
              <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
                <div className="relative">
                  <Avatar 
                    src={chat.avatar} 
                    alt={chat.name} 
                    fallback={chat.name.split(' ').map(n => n[0]).join('')}
                    online={chat.online}
                    size={sidebarCollapsed ? 'sm' : 'md'}
                  />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {chat.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full min-w-[20px] text-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
            ))
          )}
        </div>
      </motion.div>
      
      {/* Original Chatbot Section - Middle */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
        {/* Original Chat Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              {selectedChat ? (
                <>
              <Avatar 
                    src={conversations.find(chat => chat.id === selectedChat)?.avatar} 
                    alt={conversations.find(chat => chat.id === selectedChat)?.name}
                    fallback={conversations.find(chat => chat.id === selectedChat)?.name.split(' ').map(n => n[0]).join('')}
                    online={conversations.find(chat => chat.id === selectedChat)?.online}
                className="w-10 h-10"
              />
              <div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100 text-base">
                      {conversations.find(chat => chat.id === selectedChat)?.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                      {conversations.find(chat => chat.id === selectedChat)?.online ? 'online' : 'last seen today at 2:30 PM'}
                </p>
              </div>
                </>
              ) : (
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100 text-base">
                    NovaChat Assistant
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Start a new conversation
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-2 rounded-full"
                onClick={() => setShowAIConfig(true)}
                title="AI Configuration"
              >
                <Settings size={20} />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 rounded-full">
                <Video size={20} />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 rounded-full">
                <Phone size={20} />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 rounded-full">
                <MoreVertical size={20} />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Original Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {!selectedChat && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={32} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Welcome to NovaChat
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">
                Start a conversation with our AI assistant. Ask questions, get help, or just chat!
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestedPrompts.map((prompt, index) => (
                  <motion.button
                    key={prompt}
                    className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
                    onClick={() => handlePromptClick(prompt)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                  delay: index * 0.1
                }}
              >
                <Card className={`group relative max-w-xs lg:max-w-md xl:max-w-lg p-4 ${msg.sender === 'user' ? 'ml-auto bg-blue-500 text-white' : 'mr-auto'}`}>
                  {msg.sender === 'bot' ? (
                    typingMessages.has(msg.id) ? (
                      <TypingMessage 
                        content={msg.content} 
                        onComplete={() => handleTypingComplete(msg.id)}
                      />
                    ) : (
                      <MarkdownRenderer content={msg.content} />
                    )
                  ) : (
                    <div>
                      {msg.image && (
                        <ImageMessage 
                          src={msg.image} 
                          alt="Uploaded image"
                          className="mb-2"
                        />
                      )}
                      {msg.content && (
                        <p className="text-white">{msg.content}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {/* Message Actions */}
                  <motion.div
                    className={`absolute top-0 ${msg.sender === 'user' ? '-left-20' : '-right-20'} flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                  >
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Copy size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Heart size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pin size={14} />
                    </Button>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Original Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div className="flex justify-start mb-4">
                <Card className="p-4">
                  <TypingIndicator />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Original Suggested Prompts */}
        {selectedChat && messages.length <= 3 && (
          <motion.div 
            className="px-4 pb-2 flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <motion.button
                  key={prompt}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  onClick={() => handlePromptClick(prompt)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Original Message Composer */}
        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4 flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="relative flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg">
                <Button variant="ghost" size="sm" type="button" className="p-3 rounded-full">
                  <Smile size={20} />
                </Button>
                <textarea
                  ref={messageInputRef}
                  value={message}
                  onChange={(e) => {
                    // Real-time text processing for better formatting
                    let processedValue = e.target.value
                      .replace(/\s+/g, ' ') // Remove multiple spaces
                      .replace(/\s+([.!?,:;])/g, '$1') // Remove space before punctuation
                      .replace(/([.!?])\s*([a-z])/g, '$1 $2') // Add space after sentence endings
                    setMessage(processedValue)
                  }}
                  placeholder="Type a message"
                  className="flex-1 px-3 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 border-0 focus:ring-0 resize-none max-h-32 focus:outline-none"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                />
                <div className="flex items-center space-x-1 pr-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    type="button" 
                    className="p-2 rounded-full"
                    onClick={() => setShowImageUpload(true)}
                  >
                    <Paperclip size={18} />
                  </Button>
                </div>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                type="submit" 
                className="h-12 w-12 rounded-full p-0"
                disabled={!message.trim()}
              >
                <Send size={20} />
              </Button>
            </motion.div>
          </form>
        </div>
      </div>
      
      {/* WhatsApp Interface Section - Right */}
      <div className="w-96 flex flex-col h-full bg-white">
        {whatsappCurrentPage === 'chats' && (
          <WhatsAppChatsPage 
            chats={whatsappChats}
            searchQuery={whatsappSearchQuery}
            setSearchQuery={setWhatsappSearchQuery}
            filter={whatsappFilter}
            setFilter={setWhatsappFilter}
            editMode={whatsappEditMode}
            setEditMode={setWhatsappEditMode}
            selectedItems={whatsappSelectedItems}
            onItemSelect={handleWhatsappItemSelect}
            onChatSelect={(chat) => {
              setWhatsappSelectedChat(chat)
              setWhatsappCurrentPage('individual-chat')
            }}
            onNewChat={() => setShowNewChatModal(true)}
            onCamera={() => setWhatsappCurrentPage('camera')}
            onSearch={() => setShowSearchModal(true)}
            onMenu={() => setShowMenuModal(true)}
            onTabChange={handleWhatsappTabChange}
            activeTab={whatsappActiveTab}
          />
        )}

        {whatsappCurrentPage === 'individual-chat' && whatsappSelectedChat && (
          <WhatsAppIndividualChatPage
            chat={whatsappSelectedChat}
            messages={whatsappMessages}
            message={whatsappMessage}
            setMessage={setWhatsappMessage}
            isTyping={whatsappIsTyping}
            typingMessages={typingMessages}
            onSendMessage={handleWhatsappSendMessage}
            onBack={() => setWhatsappCurrentPage('chats')}
            onContactInfo={() => setWhatsappCurrentPage('contact-info')}
            onVideoCall={() => console.log('Video call')}
            onPhoneCall={() => console.log('Phone call')}
            onTypingComplete={handleTypingComplete}
            onMenu={() => setShowChatActionsModal(true)}
            onAdd={() => setShowAddModal(true)}
          />
        )}

        {whatsappCurrentPage === 'contact-info' && whatsappSelectedChat && (
          <WhatsAppContactInfoPage
            contact={whatsappSelectedChat}
            onBack={() => setWhatsappCurrentPage('individual-chat')}
            onEdit={() => setWhatsappCurrentPage('edit-contact')}
            onVideoCall={() => console.log('Video call')}
            onPhoneCall={() => console.log('Phone call')}
            onChat={() => setWhatsappCurrentPage('individual-chat')}
          />
        )}

        {whatsappCurrentPage === 'edit-contact' && whatsappSelectedChat && (
          <WhatsAppEditContactPage
            contact={whatsappSelectedChat}
            onBack={() => setWhatsappCurrentPage('contact-info')}
            onSave={() => setWhatsappCurrentPage('contact-info')}
            onCancel={() => setWhatsappCurrentPage('contact-info')}
          />
        )}

        {whatsappCurrentPage === 'status' && (
          <WhatsAppStatusPage
            statusUpdates={whatsappStatusUpdates}
            onBack={() => setWhatsappCurrentPage('chats')}
            onTabChange={handleWhatsappTabChange}
            activeTab={whatsappActiveTab}
          />
        )}

        {whatsappCurrentPage === 'camera' && (
          <WhatsAppCameraPage
            onBack={() => setWhatsappCurrentPage('chats')}
            onTabChange={handleWhatsappTabChange}
            activeTab={whatsappActiveTab}
          />
        )}

        {whatsappCurrentPage === 'calls' && (
          <WhatsAppCallsPage
            calls={whatsappCalls}
            onBack={() => setWhatsappCurrentPage('chats')}
            onTabChange={handleWhatsappTabChange}
            activeTab={whatsappActiveTab}
            editMode={whatsappEditMode}
            setEditMode={setWhatsappEditMode}
            selectedItems={whatsappSelectedItems}
            onItemSelect={handleWhatsappItemSelect}
          />
        )}

        {whatsappCurrentPage === 'settings' && (
          <WhatsAppSettingsPage
            settings={whatsappSettings}
            onBack={() => setWhatsappCurrentPage('chats')}
            onTabChange={handleWhatsappTabChange}
            activeTab={whatsappActiveTab}
            onSettingSelect={(setting) => {
              if (setting === 'starred') setWhatsappCurrentPage('starred-messages')
              else if (setting === 'account') setWhatsappCurrentPage('account-settings')
              else if (setting === 'chats') setWhatsappCurrentPage('chat-settings')
              else if (setting === 'notifications') setWhatsappCurrentPage('notification-settings')
              else if (setting === 'data') setWhatsappCurrentPage('data-settings')
              else console.log('Setting selected:', setting)
            }}
          />
        )}

        </div>
        
      {/* WhatsApp Modals */}
          <AnimatePresence>
        {/* Camera Modal */}
        {showCameraModal && (
              <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCameraModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Camera</h3>
              <div className="text-center py-8">
                <Camera size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Camera functionality would open here</p>
                <p className="text-sm text-gray-500 mt-2">Take photos or upload from gallery</p>
                      </div>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setShowCameraModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowCameraModal(false)}>
                  Open Camera
                </Button>
                  </div>
            </motion.div>
          </motion.div>
        )}
                  
        {/* Search Modal */}
        {showSearchModal && (
                  <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSearchModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Search Messages</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search in messages..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="text-sm text-gray-600">
                  <p>• Search in all conversations</p>
                  <p>• Filter by date, media, links</p>
                  <p>• Search in specific chats</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="ghost" onClick={() => setShowSearchModal(false)}>
                  Cancel
                    </Button>
                <Button onClick={() => setShowSearchModal(false)}>
                  Search
                    </Button>
              </div>
                  </motion.div>
              </motion.div>
            )}

        {/* Menu Modal */}
        {showMenuModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMenuModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900">WhatsApp Menu</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center space-x-3">
                  <Settings size={20} className="text-gray-700" />
                  <span className="text-gray-900 font-medium">Settings</span>
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center space-x-3">
                  <Archive size={20} className="text-gray-700" />
                  <span className="text-gray-900 font-medium">Archived Chats</span>
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center space-x-3">
                  <Users size={20} className="text-gray-700" />
                  <span className="text-gray-900 font-medium">New Group</span>
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg flex items-center space-x-3">
                  <User size={20} className="text-gray-700" />
                  <span className="text-gray-900 font-medium">Profile</span>
                </button>
                      </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowMenuModal(false)}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Close
                </Button>
                </div>
              </motion.div>
              </motion.div>
            )}

        {/* New Chat Modal */}
        {showNewChatModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewChatModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">New Chat</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search contacts or enter phone number..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="text-center py-4">
                  <Users size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">Start a new conversation</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="ghost" onClick={() => setShowNewChatModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowNewChatModal(false)}>
                  Start Chat
                </Button>
            </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Status Modal */}
        {showStatusModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStatusModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Status Updates</h3>
              <div className="text-center py-8">
                <RotateCcw size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Share updates with your contacts</p>
                <p className="text-sm text-gray-500 mt-2">Create status updates that disappear after 24 hours</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setShowStatusModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowStatusModal(false)}>
                  Add Status
                  </Button>
                </div>
            </motion.div>
          </motion.div>
        )}
            
        {/* Call Modal */}
        {showCallModal && (
              <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCallModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Call History</h3>
              <div className="text-center py-8">
                <Phone size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">View your call history</p>
                <p className="text-sm text-gray-500 mt-2">Voice and video calls</p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setShowCallModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowCallModal(false)}>
                  View Calls
                </Button>
              </div>
            </motion.div>
              </motion.div>
            )}
      </AnimatePresence>

      {/* Image Upload Modal */}
      <AnimatePresence>
        {showImageUpload && (
          <ImageUpload
            onImageSelect={handleImageSelect}
            onClose={() => setShowImageUpload(false)}
          />
        )}
      </AnimatePresence>

      {/* AI Configuration Modal */}
      <AIConfigModal
        isOpen={showAIConfig}
        onClose={() => setShowAIConfig(false)}
      />
    </div>
  )
}

export default Chatbot