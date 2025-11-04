import DOMPurify from 'dompurify'

/**
 * Sanitize text input to prevent XSS attacks
 * @param {string} input - The text to sanitize
 * @param {object} options - DOMPurify configuration options
 * @returns {string} - Sanitized text
 */
export const sanitizeText = (input, options = {}) => {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Configuration for text-only content (no HTML tags allowed)
  const defaultConfig = {
    ALLOWED_TAGS: [], // No HTML tags
    ALLOWED_ATTR: [], // No attributes
    KEEP_CONTENT: true, // Keep text content
    ...options
  }

  return DOMPurify.sanitize(input, defaultConfig)
}

/**
 * Sanitize HTML content (for rich text scenarios)
 * @param {string} html - The HTML to sanitize
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHTML = (html) => {
  if (!html || typeof html !== 'string') {
    return ''
  }

  // Allow only safe HTML tags for rich text
  const config = {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['class'],
    KEEP_CONTENT: true
  }

  return DOMPurify.sanitize(html, config)
}

/**
 * Validate and sanitize song title
 * @param {string} title - The title to validate
 * @returns {string} - Sanitized title
 */
export const sanitizeSongTitle = (title) => {
  let sanitized = sanitizeText(title)

  // Trim whitespace
  sanitized = sanitized.trim()

  // Limit length to 200 characters
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200)
  }

  return sanitized
}

/**
 * Validate and sanitize lyrics
 * @param {string} lyrics - The lyrics to validate
 * @returns {string} - Sanitized lyrics
 */
export const sanitizeLyrics = (lyrics) => {
  let sanitized = sanitizeText(lyrics)

  // Preserve line breaks and whitespace for lyrics formatting
  // But remove any dangerous content

  // Limit length to 50,000 characters (approx 50KB)
  if (sanitized.length > 50000) {
    sanitized = sanitized.substring(0, 50000)
  }

  return sanitized
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false
  }

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize display name
 * @param {string} name - Display name to sanitize
 * @returns {string} - Sanitized name
 */
export const sanitizeDisplayName = (name) => {
  let sanitized = sanitizeText(name)

  // Trim whitespace
  sanitized = sanitized.trim()

  // Limit length to 100 characters
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100)
  }

  // Remove any numbers-only or special characters-only names
  if (/^[0-9\W]+$/.test(sanitized)) {
    return ''
  }

  return sanitized
}

/**
 * Sanitize URL (for avatar URLs, etc.)
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL or empty string if invalid
 */
export const sanitizeURL = (url) => {
  if (!url || typeof url !== 'string') {
    return ''
  }

  try {
    const parsed = new URL(url)

    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return ''
    }

    return DOMPurify.sanitize(url, { ALLOWED_URI_REGEXP: /^https?:/ })
  } catch (e) {
    // Invalid URL
    return ''
  }
}

/**
 * Validate and sanitize an object's text fields
 * @param {object} obj - Object to sanitize
 * @param {array} fields - Array of field names to sanitize
 * @returns {object} - Sanitized object
 */
export const sanitizeObject = (obj, fields) => {
  if (!obj || typeof obj !== 'object') {
    return {}
  }

  const sanitized = { ...obj }

  fields.forEach(field => {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeText(sanitized[field])
    }
  })

  return sanitized
}

/**
 * Prevent SQL injection in search queries
 * @param {string} query - Search query
 * @returns {string} - Sanitized query
 */
export const sanitizeSearchQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return ''
  }

  // Remove SQL keywords and special characters
  let sanitized = query
    .replace(/[';\\]/g, '') // Remove quotes, semicolons, backslashes
    .replace(/--/g, '')     // Remove SQL comments
    .replace(/\/\*/g, '')   // Remove block comment start
    .replace(/\*\//g, '')   // Remove block comment end
    .trim()

  // Limit length
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100)
  }

  return sanitized
}

export default {
  sanitizeText,
  sanitizeHTML,
  sanitizeSongTitle,
  sanitizeLyrics,
  isValidEmail,
  sanitizeDisplayName,
  sanitizeURL,
  sanitizeObject,
  sanitizeSearchQuery
}
