import React, { useState, useEffect } from 'react'
import MarkdownRenderer from './MarkdownRenderer'

const TypingMessage = ({ content, onComplete, className = "" }) => {
  const [displayedContent, setDisplayedContent] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!content || typeof content !== 'string') {
      console.log('TypingMessage: Invalid content', content)
      return
    }

    // Clean the content to remove any undefined strings
    const cleanContent = content.replace(/undefined/g, '').trim()
    if (!cleanContent) {
      console.log('TypingMessage: Empty content after cleaning')
      return
    }

    let currentIndex = 0
    const totalLength = cleanContent.length
    
    const typeInterval = setInterval(() => {
      if (currentIndex >= totalLength) {
        setIsComplete(true)
        onComplete?.()
        clearInterval(typeInterval)
        return
      }

      // Add one character at a time
      const char = cleanContent[currentIndex]
      setDisplayedContent(prev => prev + char)
      currentIndex++
    }, 50) // Adjust speed here (lower = faster)

    return () => clearInterval(typeInterval)
  }, [content, onComplete])

  // Reset when content changes
  useEffect(() => {
    setDisplayedContent('')
    setIsComplete(false)
  }, [content])

  return (
    <div className={className}>
      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
        {displayedContent}
        {!isComplete && (
          <span className="inline-block w-2 h-4 bg-slate-400 ml-1 animate-pulse">
            |
          </span>
        )}
      </div>
    </div>
  )
}

export default TypingMessage
