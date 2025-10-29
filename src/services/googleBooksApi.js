// STARTER: Simplified Google Books API Service
// Students will enhance this basic implementation

/**
 * Google Books API Configuration
 * Students will learn about API endpoints and configuration
 */
const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

// Get API key from environment variables
// Students need to create .env file with their API key
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

/**
 * STARTER: Basic Book Data Transformation
 * Students can enhance this to handle more fields and edge cases
 */
function transformGoogleBookToBook(googleBook) {
  const volumeInfo = googleBook.volumeInfo || {}
  const imageLinks = volumeInfo.imageLinks || {}
  
  return {
    id: googleBook.id,
    title: volumeInfo.title || 'Unknown Title',
    authors: volumeInfo.authors || ['Unknown Author'],
    description: volumeInfo.description || 'No description available',
    publishedDate: volumeInfo.publishedDate || 'Unknown',
    pageCount: volumeInfo.pageCount || 0,
    imageLinks: {
      thumbnail: imageLinks.thumbnail || 'https://via.placeholder.com/128x192/cccccc/ffffff?text=No+Image'
    }
    // TODO: Students can add more fields like:
    // - categories
    // - publisher
    // - averageRating
    // - previewLink
  }
}

/**
 * STARTER: Basic Search Function
 * Students will enhance this with better error handling and features
 */
export async function searchBooks(query) {
  // Basic validation
  if (!query || query.trim().length === 0) {
    throw new Error('Search query is required')
  }

  try {
    // Build basic search URL
    const params = new URLSearchParams({
      q: query.trim(),
      maxResults: '20'
    })

    // Add API key if available
    if (API_KEY) {
      params.append('key', API_KEY)
    }

    const url = `${GOOGLE_BOOKS_BASE_URL}?${params.toString()}`
    
    console.log('Searching Google Books:', query)
    
    // Basic fetch request
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`)
    }

    const data = await response.json()

    // Transform and return results
    return {
      items: (data.items || []).map(transformGoogleBookToBook),
      totalItems: data.totalItems || 0
    }

  } catch (error) {
    console.error('Search error:', error)
    throw new Error('Failed to search books. Please try again.')
  }
}

/**
 * STARTER: Get Book by ID (Basic Implementation)
 * Students can enhance this function
 */
export async function getBookById(bookId) {
  if (!bookId) {
    throw new Error('Book ID is required')
  }

  try {
    const params = new URLSearchParams()
    if (API_KEY) {
      params.append('key', API_KEY)
    }

    const url = `${GOOGLE_BOOKS_BASE_URL}/${bookId}?${params.toString()}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch book: ${response.status}`)
    }

    const googleBook = await response.json()
    return transformGoogleBookToBook(googleBook)

  } catch (error) {
    console.error('Get book error:', error)
    throw new Error('Failed to fetch book details')
  }
}

/**
 * STARTER: Check if API is working
 * Simple function to test API connectivity
 */
export async function testApi() {
  try {
    const result = await searchBooks('javascript')
    return result.items.length > 0
  } catch (error) {
    return false
  }
}

/* 
  STARTER NOTES FOR STUDENTS:
  
  This is a basic implementation of Google Books API integration.
  
  TODO: Students can enhance this by adding:
  
  1. Better Error Handling:
     - Specific error messages for different HTTP status codes
     - Network connectivity checks
     - Request timeout handling
     
  2. Performance Improvements:
     - Request caching
     - Debounced search requests
     - Request cancellation
     
  3. Advanced Features:
     - Search filters (by author, subject, etc.)
     - Pagination support
     - Advanced search options
     
  4. API Key Management:
     - Better handling of missing API keys
     - Rate limiting awareness
     - Quota usage tracking
     
  5. Data Enhancement:
     - More complete book object transformation
     - Image URL fallbacks
     - Better handling of missing data
     
  The current implementation provides basic functionality that students
  can build upon throughout the course.
*/