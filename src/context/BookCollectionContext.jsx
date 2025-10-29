import { createContext, useContext, useReducer, useEffect } from 'react'
import { searchBooks as searchGoogleBooks } from '../services/googleBooksApi'

// Basic Book interface - students will expand this
const sampleBooks = [
  {
    id: '1',
    title: 'The Great Gatsby',
    authors: ['F. Scott Fitzgerald'],
    description: 'A classic American novel',
    publishedDate: '1925',
    pageCount: 180,
    imageLinks: {
      thumbnail: 'https://via.placeholder.com/128x192/4a90e2/ffffff?text=Book'
    }
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    authors: ['Harper Lee'],
    description: 'A story of racial injustice and childhood innocence',
    publishedDate: '1960',
    pageCount: 281,
    imageLinks: {
      thumbnail: 'https://via.placeholder.com/128x192/7ed321/ffffff?text=Book'
    }
  }
]

// TODO: Students need to add these missing interfaces:
// 
// interface BookCollectionState {
//   books: Book[]
//   isLoading: boolean
//   error: string | null
//   searchResults: Book[]
//   currentlyReading: Book[]
//   wantToRead: Book[]
//   haveRead: Book[]
// }
//
// interface BookCollectionActions {
//   addBook: (book: Book) => void
//   removeBook: (bookId: string) => void
//   updateBookStatus: (bookId: string, status: BookStatus) => void
//   searchBooks: (query: string) => Promise<void>
//   clearSearch: () => void
// }
//
// interface BookCollectionHelpers {
//   getBookById: (id: string) => Book | undefined
//   getBooksByStatus: (status: BookStatus) => Book[]
//   getTotalBooks: () => number
//   getReadingProgress: () => { completed: number; total: number }
// }

// Simplified context for starter version
const BookCollectionContext = createContext()

// Simple reducer - students will expand this
function bookCollectionReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOK':
      return {
        ...state,
        books: [...state.books, { ...action.payload, status: 'want-to-read' }]
      }
    case 'REMOVE_BOOK':
      return {
        ...state,
        books: state.books.filter(book => book.id !== action.payload)
      }
    case 'UPDATE_BOOK_STATUS':
      return {
        ...state,
        books: state.books.map(book =>
          book.id === action.payload.id
            ? { ...book, status: action.payload.status }
            : book
        )
      }
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload
      }
    default:
      return state
  }
}

// Initial state
const initialState = {
  books: sampleBooks.map(book => ({ ...book, status: 'want-to-read' })),
  searchResults: []
}

export function BookCollectionProvider({ children }) {
  const [state, dispatch] = useReducer(bookCollectionReducer, initialState)

  // Basic actions - students will expand these
  const addBook = (book) => {
    dispatch({ type: 'ADD_BOOK', payload: book })
  }

  const removeBook = (bookId) => {
    dispatch({ type: 'REMOVE_BOOK', payload: bookId })
  }

  const updateBookStatus = (bookId, status) => {
    dispatch({ type: 'UPDATE_BOOK_STATUS', payload: { id: bookId, status } })
  }

  // Simplified search - students will implement Google Books API
  const searchBooks = async (query) => {
    try {
      console.log('Searching for:', query)
      
      // Use real Google Books API
      const result = await searchGoogleBooks(query)
      
      // Add status field to search results
      const booksWithStatus = result.items.map(book => ({
        ...book,
        status: 'want-to-read'
      }))
      
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: booksWithStatus })
      
    } catch (error) {
      console.error('Search failed:', error)
      // Fallback to mock results if API fails
      const mockResults = [
        {
          id: `search-${Date.now()}`,
          title: `Search Result: ${query}`,
          authors: ['Sample Author'],
          description: 'This is a mock search result (API may be unavailable)',
          publishedDate: '2023',
          pageCount: 200,
          imageLinks: {
            thumbnail: 'https://via.placeholder.com/128x192/ff6b6b/ffffff?text=Search'
          }
        }
      ]
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: mockResults })
    }
  }

  const value = {
    // State
    books: state.books,
    searchResults: state.searchResults,
    
    // Actions
    addBook,
    removeBook,
    updateBookStatus,
    searchBooks,
    
    // Helper functions - students will implement these
    getBooksByStatus: (status) => state.books.filter(book => book.status === status),
    getTotalBooks: () => state.books.length
  }

  return (
    <BookCollectionContext.Provider value={value}>
      {children}
    </BookCollectionContext.Provider>
  )
}

export function useBookCollection() {
  const context = useContext(BookCollectionContext)
  if (context === undefined) {
    throw new Error('useBookCollection must be used within a BookCollectionProvider')
  }
  return context
}