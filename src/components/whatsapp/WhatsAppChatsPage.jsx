import React from 'react'
import { motion } from 'framer-motion'
import { Camera, Search, MoreVertical, Plus, MessageCircle, RotateCcw, Users, Phone, Pin } from 'lucide-react'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'

const WhatsAppChatsPage = ({
  chats,
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  editMode,
  setEditMode,
  selectedItems,
  onItemSelect,
  onChatSelect,
  onNewChat,
  onCamera,
  onSearch,
  onMenu,
  onTabChange,
  activeTab
}) => {
  return (
    <>
      {/* Header */}
      <div className="bg-[#00a884] p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-white text-sm font-medium"
            >
              {editMode ? 'Done' : 'Edit'}
            </button>
            <h1 className="text-white text-lg font-semibold">Chats</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 text-white hover:bg-white/20 rounded-full"
              onClick={onCamera}
              title="Camera"
            >
              <Camera size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 text-white hover:bg-white/20 rounded-full"
              onClick={onSearch}
              title="Search"
            >
              <Search size={20} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 text-white hover:bg-white/20 rounded-full"
              onClick={onMenu}
              title="Menu"
            >
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between text-white text-sm">
          <button className="hover:underline">Broadcast Lists</button>
          <button className="hover:underline">New Group</button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {chats
          .filter(chat => {
            if (searchQuery) {
              return chat.name.toLowerCase().includes(searchQuery.toLowerCase())
            }
            if (filter === 'unread') return chat.unread > 0
            if (filter === 'groups') return chat.type === 'group'
            return true
          })
          .map((chat) => (
            <motion.div
              key={chat.id}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
              onClick={() => !editMode && onChatSelect(chat)}
              whileHover={{ backgroundColor: '#f9f9f9' }}
            >
              {editMode && (
                <input
                  type="checkbox"
                  checked={selectedItems.includes(chat.id)}
                  onChange={() => onItemSelect(chat.id)}
                  className="mr-3 w-4 h-4 text-[#00a884] rounded"
                />
              )}
              <div className="relative mr-3">
                <Avatar 
                  src={chat.avatar} 
                  alt={chat.name}
                  fallback={chat.name.split(' ').map(n => n[0]).join('')}
                  className="w-12 h-12"
                />
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 truncate flex items-center">
                    {chat.name}
                    {chat.verified && (
                      <svg className="ml-1 w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    )}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {chat.pinned && <Pin size={14} className="text-gray-400" />}
                    <span className="text-xs text-gray-500">{chat.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="ml-2 px-2 py-1 bg-[#00a884] text-white text-xs rounded-full min-w-[20px] text-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Edit Mode Actions */}
      {editMode && selectedItems.length > 0 && (
        <div className="bg-white border-t border-gray-200 p-4 flex justify-around">
          <button className="text-red-600 font-medium">Archive</button>
          <button className="text-blue-600 font-medium">Read All</button>
          <button className="text-red-600 font-medium">Delete</button>
        </div>
      )}

      {/* Floating Action Button */}
      <motion.div
        className="absolute bottom-20 right-4"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button 
          className="w-14 h-14 rounded-full bg-[#00a884] hover:bg-[#00a884]/90 text-white p-0 shadow-lg"
          onClick={onNewChat}
          title="New Chat"
        >
          <Plus size={24} />
        </Button>
      </motion.div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 flex items-center justify-around py-2 flex-shrink-0">
        {[
          { id: 'chats', label: 'Chats', icon: MessageCircle },
          { id: 'updates', label: 'Updates', icon: RotateCcw },
          { id: 'communities', label: 'Communities', icon: Users },
          { id: 'calls', label: 'Calls', icon: Phone }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center py-2 px-3 transition-colors ${
              activeTab === tab.id ? 'text-[#00a884]' : 'text-gray-500 hover:text-gray-700'
            }`}
            title={tab.label}
          >
            <tab.icon size={24} />
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </>
  )
}

export default WhatsAppChatsPage
