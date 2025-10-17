import React from 'react'
import { ArrowLeft, MessageCircle, RotateCcw, Users, Phone, Camera } from 'lucide-react'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'

const WhatsAppSettingsPage = ({
  settings,
  onBack,
  onTabChange,
  activeTab,
  onSettingSelect
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
          <h1 className="text-white text-lg font-semibold">Settings</h1>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {/* Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <Avatar 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
              alt="Profile"
              fallback="S"
              className="w-16 h-16"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">Sabohiddin</h3>
              <p className="text-sm text-gray-600">Digital goodies designer - Pixelz</p>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="py-2">
          {settings.map((setting) => (
            <button
              key={setting.id}
              onClick={() => onSettingSelect(setting.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 text-left"
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{setting.icon}</span>
                <span className="text-gray-900">{setting.title}</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <p className="text-xs text-gray-500">WhatsApp from Facebook</p>
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

export default WhatsAppSettingsPage
