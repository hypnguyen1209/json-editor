/**
 * Utility functions for handling JSON paths
 */

/**
 * Converts a path array to a proper JSON path string
 * @param path Array of path segments
 * @returns Formatted JSON path string
 */
export const formatJsonPath = (path: string[]): string => {
  if (path.length === 0) return 'root'
  
  let result = ''
  
  for (let i = 0; i < path.length; i++) {
    const segment = path[i]
    
    // Check if the segment is a numeric index (array access)
    if (/^\d+$/.test(segment)) {
      result += `[${segment}]`
    } else {
      // Property access
      if (i === 0) {
        result = segment
      } else {
        // Check if property name needs quotes (contains special characters)
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(segment)) {
          result += `.${segment}`
        } else {
          result += `["${segment}"]`
        }
      }
    }
  }
  
  return result
}

/**
 * Copies text to clipboard
 * @param text Text to copy
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}
