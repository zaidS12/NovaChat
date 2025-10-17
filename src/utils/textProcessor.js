// Enhanced text processing utilities for better chat formatting

export const processTextForDisplay = (text) => {
  if (!text) return ''
  
  return text
    // Fix common spacing issues
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    .replace(/([a-z])(\d)/g, '$1 $2') // Add space between letters and numbers
    .replace(/(\d)([a-z])/g, '$1 $2') // Add space between numbers and letters
    
    // Fix punctuation spacing
    .replace(/\s+([.!?,:;])/g, '$1') // Remove space before punctuation
    .replace(/([.!?])\s*([a-z])/g, '$1 $2') // Add space after sentence endings
    .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Add space after sentence endings (capital letters)
    
    // Fix common grammar issues
    .replace(/\s+/g, ' ') // Remove multiple spaces
    .replace(/([.!?])\s*([.!?])/g, '$1 $2') // Fix double punctuation
    .replace(/\s+$/g, '') // Remove trailing spaces
    .replace(/^\s+/g, '') // Remove leading spaces
    
    // Fix common contractions and abbreviations
    .replace(/\bdon't\b/g, "don't")
    .replace(/\bcan't\b/g, "can't")
    .replace(/\bwon't\b/g, "won't")
    .replace(/\bisn't\b/g, "isn't")
    .replace(/\bwasn't\b/g, "wasn't")
    .replace(/\bweren't\b/g, "weren't")
    .replace(/\bhaven't\b/g, "haven't")
    .replace(/\bhasn't\b/g, "hasn't")
    .replace(/\bhadn't\b/g, "hadn't")
    .replace(/\bwouldn't\b/g, "wouldn't")
    .replace(/\bshouldn't\b/g, "shouldn't")
    .replace(/\bcouldn't\b/g, "couldn't")
    .replace(/\bmightn't\b/g, "mightn't")
    .replace(/\bmustn't\b/g, "mustn't")
    
    // Fix common technical terms
    .replace(/\bHTML\b/g, 'HTML')
    .replace(/\bCSS\b/g, 'CSS')
    .replace(/\bJavaScript\b/g, 'JavaScript')
    .replace(/\bAPI\b/g, 'API')
    .replace(/\bURL\b/g, 'URL')
    .replace(/\bHTTP\b/g, 'HTTP')
    .replace(/\bHTTPS\b/g, 'HTTPS')
    .replace(/\bJSON\b/g, 'JSON')
    .replace(/\bXML\b/g, 'XML')
    .replace(/\bSQL\b/g, 'SQL')
    .replace(/\bPHP\b/g, 'PHP')
    .replace(/\bPython\b/g, 'Python')
    .replace(/\bJava\b/g, 'Java')
    .replace(/\bC\+\+\b/g, 'C++')
    .replace(/\bC#\b/g, 'C#')
    .replace(/\bReact\b/g, 'React')
    .replace(/\bVue\b/g, 'Vue')
    .replace(/\bAngular\b/g, 'Angular')
    .replace(/\bNode\.js\b/g, 'Node.js')
    .replace(/\bExpress\b/g, 'Express')
    .replace(/\bMongoDB\b/g, 'MongoDB')
    .replace(/\bMySQL\b/g, 'MySQL')
    .replace(/\bPostgreSQL\b/g, 'PostgreSQL')
    
    // Fix common symbols and special characters
    .replace(/\s*&\s*/g, ' & ') // Proper spacing around ampersand
    .replace(/\s*@\s*/g, ' @ ') // Proper spacing around @
    .replace(/\s*#\s*/g, ' # ') // Proper spacing around #
    .replace(/\s*%\s*/g, ' % ') // Proper spacing around %
    .replace(/\s*\+\s*/g, ' + ') // Proper spacing around +
    .replace(/\s*=\s*/g, ' = ') // Proper spacing around =
    .replace(/\s*<\s*/g, ' < ') // Proper spacing around <
    .replace(/\s*>\s*/g, ' > ') // Proper spacing around >
    
    // Fix common programming patterns
    .replace(/\s*\(\s*/g, ' (') // Space before opening parenthesis
    .replace(/\s*\)\s*/g, ') ') // Space after closing parenthesis
    .replace(/\s*\[\s*/g, ' [') // Space before opening bracket
    .replace(/\s*\]\s*/g, '] ') // Space after closing bracket
    .replace(/\s*{\s*/g, ' {') // Space before opening brace
    .replace(/\s*}\s*/g, '} ') // Space after closing brace
    
    // Final cleanup
    .replace(/\s+/g, ' ') // Remove multiple spaces again
    .trim()
}

export const shouldBreakLine = (line, nextLine) => {
  if (!line.trim()) return true
  
  // Break after sentence endings
  if (line.endsWith('.') || line.endsWith('!') || line.endsWith('?')) return true
  
  // Break after colons and semicolons
  if (line.endsWith(':') || line.endsWith(';')) return true
  
  // Don't break after commas
  if (line.endsWith(',')) return false
  
  // Break if line is too long
  if (line.length > 80) return true
  
  // Break before headers
  if (nextLine && nextLine.startsWith('#')) return true
  
  // Break before lists
  if (nextLine && (nextLine.startsWith('- ') || nextLine.startsWith('* ') || nextLine.match(/^\d+\. /))) return true
  
  // Break before code blocks
  if (nextLine && nextLine.startsWith('```')) return true
  
  // Break before new paragraphs (empty lines)
  if (nextLine && nextLine.trim() === '') return true
  
  return false
}

export const formatInlineText = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-100">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-slate-200">$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors">$1</a>')
    .replace(/([.!?])\s*([a-z])/g, '$1 $2') // Fix sentence spacing
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Fix camelCase spacing
}

export const processCodeBlock = (content) => {
  const lines = content.split('\n')
  const language = lines[0].match(/^[a-zA-Z]+$/) ? lines[0] : ''
  const code = language ? lines.slice(1).join('\n') : content
  
  return { language, code }
}
