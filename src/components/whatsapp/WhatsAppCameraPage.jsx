import React from 'react'
import { ArrowLeft, X, Zap, RotateCcw, MessageCircle, Users, Phone, Camera } from 'lucide-react'
import Button from '../ui/Button'

const WhatsAppCameraPage = ({
  onBack,
  onTabChange,
  activeTab
}) => {
  return (
    <>
      {/* Camera Interface */}
      <div className="flex-1 bg-black relative">
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="p-2 text-white hover:bg-white/20 rounded-full"
            title="Close"
          >
            <X size={20} />
          </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 text-white hover:bg-white/20 rounded-full"
              title="Flash"
            >
              <Zap size={20} />
            </Button>
        </div>

        {/* Camera Preview Area */}
        <div className="w-full h-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-32 h-32 border-4 border-white/30 rounded-full flex items-center justify-center mb-4">
              <div className="w-24 h-24 bg-white/20 rounded-full"></div>
            </div>
            <p className="text-lg font-medium">Camera View</p>
            <p className="text-sm opacity-80">Live camera feed would appear here</p>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
          {/* Gallery Preview */}
          <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-400 rounded"></div>
          </div>

          {/* Shutter Button */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-14 h-14 bg-white border-4 border-gray-300 rounded-full"></div>
            </div>
            <p className="text-white text-xs mt-2">Hold for video, tap for photo</p>
          </div>

          {/* Camera Flip */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 text-white hover:bg-white/20 rounded-full"
            title="Flip Camera"
          >
            <RotateCcw size={20} />
          </Button>
        </div>

        {/* Gallery Preview 2 */}
        <div className="absolute bottom-20 right-4 w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-400 rounded"></div>
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

export default WhatsAppCameraPage
