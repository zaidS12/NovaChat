import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Video, Phone, MoreVertical, Plus, Smile, Paperclip, Send } from 'lucide-react'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import MarkdownRenderer from '../ui/MarkdownRenderer'
import TypingMessage from '../ui/TypingMessage'
import ImageMessage from '../ui/ImageMessage'

const WhatsAppIndividualChatPage = ({
  chat,
  messages,
  message,
  setMessage,
  isTyping,
  typingMessages,
  onSendMessage,
  onBack,
  onContactInfo,
  onVideoCall,
  onPhoneCall,
  onMenu,
  onAdd,
  onTypingComplete
}) => {
  return (
    <>
      {/* Chat Header */}
      <div className="bg-[#00a884] p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="p-2 text-white hover:bg-white/20"
              title="Back"
            >
              <ArrowLeft size={20} />
            </Button>
            <Avatar 
              src={chat.avatar} 
              alt={chat.name}
              fallback={chat.name.split(' ').map(n => n[0]).join('')}
              className="w-10 h-10"
            />
            <div onClick={onContactInfo} className="cursor-pointer">
              <h3 className="font-medium text-white text-base">{chat.name}</h3>
              <p className="text-sm text-white/80">tap here for contact info</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 text-white hover:bg-white/20 rounded-full"
              onClick={onVideoCall}
            >
              <Video size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 text-white hover:bg-white/20 rounded-full"
              onClick={onPhoneCall}
            >
              <Phone size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 text-white hover:bg-white/20 rounded-full"
              onClick={onMenu}
            >
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0 bg-gray-50">
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
                        ? 'bg-[#00a884] text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-sm'
                    }`}
                >
                  {msg.sender === 'bot' ? (
                    typingMessages && typingMessages.has(msg.id) ? (
                      <TypingMessage 
                        content={msg.content} 
                        onComplete={() => onTypingComplete && onTypingComplete(msg.id)}
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
                  <span className="text-xs text-gray-500">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.sender === 'user' && (
                    <div className="flex items-center">
                      <svg width="16" height="15" viewBox="0 0 16 15" className="text-blue-500">
                        <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l3.61 3.463c.143.14.361.125.484-.033L10.91 3.879a.366.366 0 0 0-.063-.51z"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <AnimatePresence>
          {isTyping && (
            <motion.div className="flex justify-start mb-1">
              <div className="bg-white rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg px-3 py-2 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        <form onSubmit={onSendMessage} className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative flex items-center bg-gray-100 rounded-lg">
              <Button 
                variant="ghost" 
                size="sm" 
                type="button" 
                className="p-3 text-gray-600 hover:bg-gray-200 rounded-full"
                onClick={onAdd}
              >
                <Plus size={20} />
              </Button>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="+ Message"
                className="flex-1 px-3 py-3 bg-transparent text-gray-900 placeholder-gray-500 border-0 focus:ring-0 resize-none max-h-32 focus:outline-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    onSendMessage(e)
                  }
                }}
              />
              <Button 
                variant="ghost" 
                size="sm" 
                type="button" 
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-full"
              >
                <Smile size={18} />
              </Button>
            </div>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="submit" 
              className="h-12 w-12 rounded-full p-0 bg-[#00a884] hover:bg-[#00a884]/90"
              disabled={!message.trim()}
            >
              <Send size={20} />
            </Button>
          </motion.div>
        </form>
      </div>
    </>
  )
}

export default WhatsAppIndividualChatPage
