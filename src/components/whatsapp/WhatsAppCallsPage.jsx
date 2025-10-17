import React from 'react'
import { ArrowLeft, Phone, Video, MoreVertical, MessageCircle, RotateCcw, Users, Camera } from 'lucide-react'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'

const WhatsAppCallsPage = ({
  calls,
  onBack,
  onTabChange,
  activeTab,
  editMode,
  setEditMode,
  selectedItems,
  onItemSelect
}) => {
  return (
    <>
      {/* Header */}
      <div className="bg-[#00a884] p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-2 text-white hover:bg-white/20"
            title="Back"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-white text-lg font-semibold">Calls</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-white text-sm font-medium"
            >
              {editMode ? 'Done' : 'Edit'}
            </button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 text-white hover:bg-white/20 rounded-full"
              title="More"
            >
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>

        {/* Call Filters */}
        <div className="mt-4 flex space-x-1">
          {['All', 'Missed', 'Clear'].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === 'All' 
                  ? 'bg-white text-[#00a884]' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Calls List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {calls.map((call) => (
          <div key={call.id} className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
            {editMode && (
              <input
                type="checkbox"
                checked={selectedItems.includes(call.id)}
                onChange={() => onItemSelect(call.id)}
                className="mr-3 w-4 h-4 text-[#00a884] rounded"
              />
            )}
            <div className="relative mr-3">
              <Avatar 
                src={call.avatar} 
                alt={call.name}
                fallback={call.name.split(' ').map(n => n[0]).join('')}
                className="w-12 h-12"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900 truncate">{call.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{call.timestamp}</span>
                  <MoreVertical size={16} className="text-gray-400" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {call.type === 'outgoing' && (
                    <Phone size={14} className="text-green-500" />
                  )}
                  {call.type === 'incoming' && (
                    <Phone size={14} className="text-blue-500" />
                  )}
                  {call.type === 'missed' && (
                    <Phone size={14} className="text-red-500" />
                  )}
                  <span className={`text-sm ${
                    call.type === 'missed' ? 'text-red-500' : 'text-gray-600'
                  }`}>
                    {call.type === 'outgoing' ? 'Outgoing' : 
                     call.type === 'incoming' ? 'Incoming' : 'Missed'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{call.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Mode Actions */}
      {editMode && selectedItems.length > 0 && (
        <div className="bg-white border-t border-gray-200 p-4 flex justify-around">
          <button className="text-red-600 font-medium">Delete</button>
          <button className="text-blue-600 font-medium">Clear All</button>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 flex items-center justify-around py-2 flex-shrink-0">
        {[
          { id: 'updates', label: 'Status', icon: RotateCcw },
          { id: 'calls', label: 'Calls', icon: Phone },
          { id: 'camera', label: 'Camera', icon: Camera },
          { id: 'chats', label: 'Chats', icon: MessageCircle },
          { id: 'settings', label: 'Settings', icon: Users }
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

export default WhatsAppCallsPage
