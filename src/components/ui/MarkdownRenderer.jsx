import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { 
  processTextForDisplay, 
  shouldBreakLine, 
  formatInlineText, 
  processCodeBlock 
} from '../../utils/textProcessor'

const MarkdownRenderer = ({ content, className = "" }) => {
  // Split content by code blocks
  const parts = content.split(/(```[\s\S]*?```)/g)
  
  return (
    <div className={`markdown-content ${className}`}>
      {parts.map((part, index) => {
        // Check if this part is a code block
        if (part.startsWith('```') && part.endsWith('```')) {
          const codeContent = part.slice(3, -3).trim()
          const { language, code } = processCodeBlock(codeContent)
          
          return (
            <div key={index} className="my-4">
              <div className="bg-slate-800 rounded-t-lg border border-slate-700">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-700 rounded-t-lg">
                  <span className="text-sm font-medium text-slate-300">
                    {language || 'code'}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(code)}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    Copy code
                  </button>
                </div>
                <SyntaxHighlighter
                  language={language || 'text'}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0 0 0.5rem 0.5rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.5'
                  }}
                  showLineNumbers={false}
                  wrapLines={true}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            </div>
          )
        }
        
        // Regular text content with enhanced processing
        if (part.trim()) {
          const lines = part.split('\n')
          const processedLines = []
          
          for (let i = 0; i < lines.length; i++) {
            const line = processTextForDisplay(lines[i])
            const nextLine = i < lines.length - 1 ? processTextForDisplay(lines[i + 1]) : null
            
            if (line.trim()) {
              processedLines.push({
                content: line,
                shouldBreak: shouldBreakLine(line, nextLine),
                originalIndex: i
              })
            }
          }
          
          return (
            <div key={index} className="prose prose-invert max-w-none">
              {processedLines.map((lineObj, lineIndex) => {
                const { content: line, shouldBreak } = lineObj
                
                // Handle different markdown elements
                if (line.startsWith('### ')) {
                  return (
                    <h3 key={lineIndex} className="text-lg font-semibold text-slate-200 mt-4 mb-2">
                      {line.slice(4)}
                    </h3>
                  )
                }
                if (line.startsWith('## ')) {
                  return (
                    <h2 key={lineIndex} className="text-xl font-bold text-slate-100 mt-6 mb-3">
                      {line.slice(3)}
                    </h2>
                  )
                }
                if (line.startsWith('# ')) {
                  return (
                    <h1 key={lineIndex} className="text-2xl font-bold text-slate-100 mt-8 mb-4">
                      {line.slice(2)}
                    </h1>
                  )
                }
                if (line.startsWith('- ')) {
                  return (
                    <li key={lineIndex} className="text-slate-300 ml-4 mb-1">
                      {line.slice(2)}
                    </li>
                  )
                }
                if (line.startsWith('* ')) {
                  return (
                    <li key={lineIndex} className="text-slate-300 ml-4 mb-1">
                      {line.slice(2)}
                    </li>
                  )
                }
                if (line.match(/^\d+\. /)) {
                  return (
                    <li key={lineIndex} className="text-slate-300 ml-4 mb-1">
                      {line.replace(/^\d+\. /, '')}
                    </li>
                  )
                }
                
                // Handle inline formatting with enhanced text processing
                const formatText = (text) => formatInlineText(text)
                
                return (
                  <p 
                    key={lineIndex} 
                    className={`text-slate-300 leading-relaxed ${
                      shouldBreak ? 'mb-3' : 'mb-1'
                    } ${
                      line.length > 80 ? 'text-justify' : ''
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatText(line) }}
                  />
                )
              })}
            </div>
          )
        }
        
        return null
      })}
    </div>
  )
}

export default MarkdownRenderer
