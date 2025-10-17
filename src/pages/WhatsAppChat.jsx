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
  Camera,
  Plus,
  Check,
  CheckCheck,
  MessageCircle,
  Clock,
  Settings,
  Archive,
  Star,
  MoreHorizontal
} from 'lucide-react'
import Button from '../components/ui/Button'
import MarkdownRenderer from '../components/ui/MarkdownRenderer'
import TypingMessage from '../components/ui/TypingMessage'
import ImageUpload from '../components/ui/ImageUpload'
import ImageMessage from '../components/ui/ImageMessage'
import Avatar from '../components/ui/Avatar'
import { generateGeminiResponse } from '../utils/geminiApi'
import { testGeminiAPI } from '../utils/testGeminiApi'

const WhatsAppChat = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: 'Hey! This is the WhatsApp interface. How can I help you?',
      sender: 'bot',
      timestamp: new Date(),
      read: true
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [typingMessages, setTypingMessages] = useState(new Set())
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [selectedChat, setSelectedChat] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentView, setCurrentView] = useState('chats') // chats, status, calls
  const [showChatList, setShowChatList] = useState(true)
  const messagesEndRef = useRef(null)
  
  const conversations = [
    {
      id: 1,
      name: 'NovaChat Assistant',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'I\'d be happy to help you...',
      timestamp: '2m ago',
      unread: 0,
      online: true,
      pinned: false
    },
    {
      id: 2,
      name: 'Support Team',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Your ticket has been resolved',
      timestamp: '1h ago',
      unread: 2,
      online: false,
      pinned: false
    },
    {
      id: 3,
      name: 'General Chat',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Welcome to the community!',
      timestamp: '3h ago',
      unread: 0,
      online: true,
      pinned: true
    },
    {
      id: 4,
      name: 'Tech Updates',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'New features released',
      timestamp: 'Yesterday',
      unread: 5,
      online: false,
      pinned: false
    },
    {
      id: 5,
      name: 'Product Team',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Meeting at 3 PM',
      timestamp: 'Yesterday',
      unread: 0,
      online: true,
      pinned: false
    }
  ]
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
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

  const handleImageSelect = (imageData) => {
    const imageMessage = {
      id: messages.length + 1,
      content: '',
      image: imageData,
      sender: 'user',
      timestamp: new Date(),
      read: false
    }
    setMessages(prev => [...prev, imageMessage])
    setShowImageUpload(false)
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
      timestamp: new Date(),
      read: false
    }
    
    setMessages(prev => [...prev, newMessage])
    setMessage('')
    setIsTyping(true)
    
    // Get response from Gemini API
    try {
      const conversationHistory = [...messages, newMessage]
      const botResponseText = await generateGeminiResponse(conversationHistory)
      
      // Ensure the response is a valid string
      if (!botResponseText || typeof botResponseText !== 'string') {
        console.error('Invalid bot response:', botResponseText)
        throw new Error('Invalid response from API')
      }
      
      const botResponse = {
        id: messages.length + 2,
        content: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
        read: true,
        typing: true
      }
      setMessages(prev => [...prev, botResponse])
      setTypingMessages(prev => new Set([...prev, botResponse.id]))
    } catch (error) {
      console.error('Error getting bot response:', error)
      const errorResponse = {
        id: messages.length + 2,
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
        read: true,
        typing: true
      }
      setMessages(prev => [...prev, errorResponse])
      setTypingMessages(prev => new Set([...prev, errorResponse.id]))
    } finally {
      setIsTyping(false)
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
          className="w-2 h-2 bg-[#8696a0] rounded-full"
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

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const getReadStatus = (msg) => {
    if (msg.sender !== 'user') return null
    if (msg.read) {
      return (
        <CheckCheck size={16} className="text-[#53bdeb]" />
      )
    }
    return <CheckCheck size={16} className="text-[#8696a0]" />
  }

  return (
    <div className="h-screen flex bg-[#0b141a] overflow-hidden">
      {/* Chat List Sidebar */}
      <motion.div 
        className={`${showChatList ? 'w-80' : 'w-0'} bg-[#111b21] border-r border-[#313d45] flex flex-col h-full transition-all duration-300 ease-in-out overflow-hidden`}
        initial={false}
        animate={{ width: showChatList ? 320 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* WhatsApp Header */}
        <div className="bg-[#202c33] p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <h1 className="text-xl font-semibold text-[#e9edef]">WhatsApp</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2 text-[#aebac1] hover:bg-[#313d45] rounded-full">
              <Camera size={20} />
            </Button>
            <Button variant="ghost" size="sm" className="p-2 text-[#aebac1] hover:bg-[#313d45] rounded-full">
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8696a0]" size={16} />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="w-full pl-9 pr-4 py-2 bg-[#202c33] border-0 rounded-lg focus:ring-2 focus:ring-[#00a884] text-[#e9edef] placeholder-[#8696a0] text-sm"
            />
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="px-4 pb-2">
          <div className="flex space-x-8 border-b border-[#313d45]">
            {[
              { key: 'chats', label: 'Chats', icon: MessageCircle },
              { key: 'status', label: 'Status', icon: Clock },
              { key: 'calls', label: 'Calls', icon: Phone }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCurrentView(tab.key)}
                className={`pb-3 px-2 flex items-center space-x-2 text-sm font-medium transition-colors ${
                  currentView === tab.key 
                    ? 'text-[#00a884] border-b-2 border-[#00a884]' 
                    : 'text-[#8696a0] hover:text-[#e9edef]'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {currentView === 'chats' && conversations.map((chat, index) => (
            <motion.div
              key={chat.id}
              className="p-4 border-b border-[#313d45] cursor-pointer transition-colors hover:bg-[#202c33] active:bg-[#2a3942]"
              onClick={() => {
                setSelectedChat(index)
                setShowChatList(false)
              }}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar 
                    src={chat.avatar} 
                    alt={chat.name} 
                    fallback={chat.name.split(' ').map(n => n[0]).join('')}
                    online={chat.online}
                    size="md"
                    className="border border-[#313d45]"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#e9edef] truncate flex items-center">
                      {chat.name}
                      {chat.pinned && <Pin size={14} className="ml-1 text-[#8696a0]" />}
                    </h3>
                    <span className="text-xs text-[#8696a0]">
                      {chat.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-[#8696a0] truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unread > 0 && (
                      <span className="ml-2 px-2 py-1 bg-[#00a884] text-white text-xs rounded-full min-w-[20px] text-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {currentView === 'status' && (
            <div className="p-4">
              <div className="flex items-center space-x-3 p-3 bg-[#202c33] rounded-lg mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#00a884] to-[#00a884]/70 rounded-full flex items-center justify-center">
                  <Plus size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-[#e9edef]">My Status</h3>
                  <p className="text-sm text-[#8696a0]">Tap to add status update</p>
                </div>
              </div>
              <div className="text-sm text-[#8696a0] mb-2">Recent Updates</div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 hover:bg-[#202c33] rounded-lg cursor-pointer">
                  <Avatar size="md" fallback={`U${i}`} />
                  <div>
                    <h3 className="font-medium text-[#e9edef]">User {i}</h3>
                    <p className="text-sm text-[#8696a0]">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {currentView === 'calls' && (
            <div className="p-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 hover:bg-[#202c33] rounded-lg cursor-pointer">
                  <Avatar size="md" fallback={`U${i}`} />
                  <div className="flex-1">
                    <h3 className="font-medium text-[#e9edef]">User {i}</h3>
                    <p className="text-sm text-[#8696a0]">
                      {i % 2 === 0 ? 'Incoming call' : 'Outgoing call'} • 2 minutes ago
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="p-2 text-[#00a884] hover:bg-[#313d45] rounded-full">
                      <Phone size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2 text-[#00a884] hover:bg-[#313d45] rounded-full">
                      <Video size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-[#0b141a]">
        {!showChatList ? (
          <>
            {/* Chat Header */}
            <div className="bg-[#202c33] border-b border-[#313d45] p-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowChatList(true)}
                    className="p-2 text-[#aebac1] hover:bg-[#313d45]"
                  >
                    <ArrowLeft size={20} />
                  </Button>
                  <Avatar 
                    src={conversations[selectedChat]?.avatar} 
                    alt={conversations[selectedChat]?.name}
                    fallback={conversations[selectedChat]?.name.split(' ').map(n => n[0]).join('')}
                    online={conversations[selectedChat]?.online}
                    className="w-10 h-10 border border-[#313d45]"
                  />
                  <div>
                    <h3 className="font-medium text-[#e9edef] text-base">
                      {conversations[selectedChat]?.name}
                    </h3>
                    <p className="text-sm text-[#8696a0]">
                      {conversations[selectedChat]?.online ? 'online' : 'last seen today at 2:30 PM'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="p-2 text-[#aebac1] hover:bg-[#313d45] rounded-full">
                    <Video size={20} />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 text-[#aebac1] hover:bg-[#313d45] rounded-full">
                    <Phone size={20} />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2 text-[#aebac1] hover:bg-[#313d45] rounded-full">
                    <MoreVertical size={20} />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Messages Area */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0 bg-[#0b141a] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjEiIGZpbGw9IiMxZTJhMzIiIG9wYWNpdHk9IjAuMyIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+Cjwvc3ZnPg==')] bg-repeat"
            >
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-1`}
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
                    <div className={`group relative max-w-xs lg:max-w-md xl:max-w-lg ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                      <div
                        className={`px-3 py-2 relative ${
                          msg.sender === 'user'
                            ? 'bg-[#005c4b] text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-sm'
                            : 'bg-[#202c33] text-[#e9edef] rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg'
                        }`}
                        style={{
                          boxShadow: '0 1px 0.5px rgba(0,0,0,.13)'
                        }}
                      >
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
                      </div>
                      
                      <div className={`flex items-center justify-end mt-1 space-x-1 ${
                        msg.sender === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        <span className="text-xs text-[#8696a0]">
                          {formatTime(msg.timestamp)}
                        </span>
                        {getReadStatus(msg)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div className="flex justify-start mb-1">
                    <div className="bg-[#202c33] rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg px-3 py-2" style={{
                      boxShadow: '0 1px 0.5px rgba(0,0,0,.13)'
                    }}>
                      <TypingIndicator />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Composer */}
            <div className="bg-[#202c33] border-t border-[#313d45] p-4 flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                <div className="flex-1">
                  <div className="relative flex items-center bg-[#2a3942] rounded-lg">
                    <Button variant="ghost" size="sm" type="button" className="p-3 text-[#8696a0] hover:bg-[#313d45] rounded-full">
                      <Smile size={20} />
                    </Button>
                    <textarea
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
                      className="flex-1 px-3 py-3 bg-transparent text-[#e9edef] placeholder-[#8696a0] border-0 focus:ring-0 resize-none max-h-32 focus:outline-none"
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
                        className="p-2 text-[#8696a0] hover:bg-[#313d45] rounded-full"
                        onClick={() => setShowImageUpload(true)}
                      >
                        <Paperclip size={18} />
                      </Button>
                      {!message.trim() && (
                        <Button variant="ghost" size="sm" type="button" className="p-2 text-[#8696a0] hover:bg-[#313d45] rounded-full">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                          </svg>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {message.trim() && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Button 
                      type="submit" 
                      className="h-12 w-12 rounded-full p-0 bg-[#00a884] hover:bg-[#00a884]/90 text-white"
                    >
                      <Send size={20} />
                    </Button>
                  </motion.div>
                )}
              </form>
            </div>
          </>
        ) : (
          /* Welcome Screen when no chat selected */
          <div className="flex-1 flex items-center justify-center bg-[#0b141a]">
            <div className="text-center">
              <div className="w-24 h-24 bg-[#00a884] rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-[#e9edef] mb-2">WhatsApp Web</h2>
              <p className="text-[#8696a0] mb-6">Send and receive messages without keeping your phone online.</p>
              <p className="text-[#8696a0] text-sm">Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>
            </div>
          </div>
        )}
      </div>

      {/* Image Upload Modal */}
      <AnimatePresence>
        {showImageUpload && (
          <ImageUpload
            onImageSelect={handleImageSelect}
            onClose={() => setShowImageUpload(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default WhatsAppChat
