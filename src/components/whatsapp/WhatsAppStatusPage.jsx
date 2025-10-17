import React from 'react'
import { ArrowLeft, Camera, Edit3, MessageCircle, RotateCcw, Users, Phone } from 'lucide-react'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'

const WhatsAppStatusPage = ({
  statusUpdates,
  onBack,
  onTabChange,
  activeTab
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
          <div className="flex space-x-4">
            <button className={`text-sm font-medium ${activeTab === 'privacy' ? 'text-white' : 'text-white/70'}`}>
              Privacy
            </button>
            <button className={`text-sm font-medium ${activeTab === 'status' ? 'text-white' : 'text-white/70'}`}>
              Status
            </button>
          </div>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Status Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {/* My Status */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Avatar 
              src={statusUpdates[0]?.avatar} 
              alt="My Status"
              fallback="MS"
              className="w-16 h-16"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">My Status</h3>
              <p className="text-sm text-gray-600">{statusUpdates[0]?.time}</p>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Camera size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Edit3 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Updates</h4>
          {statusUpdates.slice(1).map((status) => (
            <div key={status.id} className="flex items-center space-x-4 py-3">
              <Avatar 
                src={status.avatar} 
                alt={status.name}
                fallback={status.name.split(' ').map(n => n[0]).join('')}
                className="w-12 h-12"
              />
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{status.name}</h5>
                <p className="text-sm text-gray-600">{status.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* No Updates Message */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No recent updates to show right now.</p>
        </div>
      </div>

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

export default WhatsAppStatusPage
