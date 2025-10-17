import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Eye, X } from 'lucide-react'
import Button from './Button'

const ImageMessage = ({ src, alt = "Image", className = "", onRemove }) => {
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = `image-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  if (imageError) {
    return (
      <div className={`bg-slate-100 dark:bg-slate-700 rounded-lg p-4 text-center ${className}`}>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Failed to load image
        </p>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="mt-2"
          >
            Remove
          </Button>
        )}
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative group ${className}`}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setShowFullscreen(true)}
          onError={handleImageError}
        />
        
        {/* Image actions overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullscreen(true)}
              className="bg-black/50 text-white hover:bg-black/70 p-1"
            >
              <Eye size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="bg-black/50 text-white hover:bg-black/70 p-1"
            >
              <Download size={14} />
            </Button>
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="bg-black/50 text-white hover:bg-black/70 p-1"
              >
                <X size={14} />
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Fullscreen modal */}
      {showFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setShowFullscreen(false)}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
            >
              <X size={20} />
            </Button>
          </div>
        </motion.div>
      )}
    </>
  )
}

export default ImageMessage
