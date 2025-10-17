import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Image as ImageIcon, Camera } from 'lucide-react'
import Button from './Button'

const ImageUpload = ({ onImageSelect, onClose, className = "" }) => {
  const fileInputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleSend = () => {
    if (preview) {
      onImageSelect(preview)
      setPreview(null)
      onClose()
    }
  }

  const handleRemovePreview = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${className}`}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Upload Image
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
          >
            <X size={20} />
          </Button>
        </div>

        {preview ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemovePreview}
                className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
              >
                <X size={16} />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleSend}
                className="flex-1"
              >
                Send Image
              </Button>
              <Button
                variant="outline"
                onClick={handleRemovePreview}
                className="flex-1"
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-300 dark:border-slate-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full">
                  <ImageIcon size={32} className="text-slate-600 dark:text-slate-400" />
                </div>
              </div>
              
              <div>
                <p className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                  {dragActive ? 'Drop your image here' : 'Upload an image'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Drag and drop or click to select
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload size={16} className="mr-2" />
                  Choose File
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Camera size={16} className="mr-2" />
                  Camera
                </Button>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.div>
    </motion.div>
  )
}

export default ImageUpload
