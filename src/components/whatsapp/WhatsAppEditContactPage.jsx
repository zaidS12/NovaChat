import React, { useState } from 'react'
import { ArrowLeft, X } from 'lucide-react'
import Button from '../ui/Button'

const WhatsAppEditContactPage = ({
  contact,
  onBack,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    firstName: contact.name.split(' ')[0] || '',
    lastName: contact.name.split(' ').slice(1).join(' ') || '',
    phone: '+1 202 555 0181'
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <>
      {/* Header */}
      <div className="bg-[#00a884] p-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="p-2 text-white hover:bg-white/20"
            title="Cancel"
          >
            <X size={20} />
          </Button>
          <h1 className="text-white text-lg font-semibold">Edit Contact</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSave}
            className="p-2 text-white hover:bg-white/20"
            title="Save"
          >
            <span className="text-sm font-medium">Save</span>
          </Button>
        </div>
      </div>

      {/* Edit Form */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="p-6 space-y-6">
          {/* Name Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a884] focus:border-transparent"
                  placeholder="First name"
                />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a884] focus:border-transparent"
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">New Zealand</span>
                <span className="text-sm text-gray-400">mobile</span>
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a884] focus:border-transparent"
                placeholder="+1 202 555 0181"
              />
            </div>
          </div>

          {/* More Fields */}
          <div>
            <button className="text-[#00a884] text-sm font-medium hover:underline">
              more fields
            </button>
          </div>

          {/* Delete Contact */}
          <div className="pt-6 border-t border-gray-200">
            <button className="text-red-600 text-sm font-medium hover:underline">
              Delete Contact
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default WhatsAppEditContactPage
