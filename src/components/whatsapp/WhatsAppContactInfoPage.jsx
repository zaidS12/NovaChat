import React from 'react'
import { ArrowLeft, Video, Phone, MessageCircle } from 'lucide-react'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'

const WhatsAppContactInfoPage = ({
  contact,
  onBack,
  onEdit,
  onVideoCall,
  onPhoneCall,
  onChat
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
          <h1 className="text-white text-lg font-semibold">Contact Info</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onEdit}
            className="p-2 text-white hover:bg-white/20"
            title="Edit"
          >
            <span className="text-sm font-medium">Edit</span>
          </Button>
        </div>
      </div>

      {/* Contact Info Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {/* Profile Picture */}
        <div className="p-6 text-center">
          <Avatar 
            src={contact.avatar} 
            alt={contact.name}
            fallback={contact.name.split(' ').map(n => n[0]).join('')}
            className="w-24 h-24 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-900 mb-1">{contact.name}</h2>
          <p className="text-gray-600 mb-4">+1 202 555 0181</p>
          <p className="text-gray-500 text-sm italic">"Design adds value faster, than it adds cost"</p>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-center space-x-8">
            <button 
              onClick={onChat}
              className="flex flex-col items-center space-y-2 text-gray-600 hover:text-gray-800"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageCircle size={24} />
              </div>
              <span className="text-sm">Chat</span>
            </button>
            <button 
              onClick={onVideoCall}
              className="flex flex-col items-center space-y-2 text-gray-600 hover:text-gray-800"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Video size={24} />
              </div>
              <span className="text-sm">Video</span>
            </button>
            <button 
              onClick={onPhoneCall}
              className="flex flex-col items-center space-y-2 text-gray-600 hover:text-gray-800"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Phone size={24} />
              </div>
              <span className="text-sm">Audio</span>
            </button>
          </div>
        </div>

        {/* Media, Links, and Docs */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Media, Links, and Docs</span>
            <span className="text-gray-400">12</span>
          </div>
        </div>

        {/* Starred Messages */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Starred Messages</span>
            <span className="text-gray-400">None</span>
          </div>
        </div>

        {/* Chat Search */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Chat Search</span>
            <span className="text-gray-400">→</span>
          </div>
        </div>

        {/* Mute */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Mute</span>
            <span className="text-gray-400">No</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default WhatsAppContactInfoPage
