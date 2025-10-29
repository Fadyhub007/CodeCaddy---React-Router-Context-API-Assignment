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
      thumbnail: 'https://via.placeholder.com/128x192/4a90e2/ffffff?text=Book',
    },
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    authors: ['Harper Lee'],
    description: 'A story of racial injustice and childhood innocence',
    publishedDate: '1960',
    pageCount: 281,
    imageLinks: {
      thumbnail: 'https://via.placeholder.com/128x192/7ed321/ffffff?text=Book',
    },
  },
]

// ✅ Context setup
const BookCollectionContext = createContext()

function bookCollectionReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOK':
      return {
        ...state,
        books: [...state.books, { ...action.payload, status: 'want-to-read' }],
      }
    case 'REMOVE_BOOK':
      return {
        ...state,
        books: state.books.filter((book) => book.id !== action.payload),
      }
    case 'UPDATE_BOOK_STATUS':
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload.id
            ? { ...book, status: action.payload.status }
            : book
        ),
      }
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload,
      }
    case 'CLEAR_SEARCH':
      return {
        ...state,
        searchResults: [],
      }
    default:
      return state
  }
}

const initialState = {
  books: sampleBooks.map((book) => ({ ...book, status: 'want-to-read' })),
  searchResults: [],
  isLoading: false,
  error: null,
}

export function BookCollectionProvider({ children }) {
  const [state, dispatch] = useReducer(bookCollectionReducer, initialState)

  // 🎯 Actions
  const addBook = (book) => {
    dispatch({ type: 'ADD_BOOK', payload: book })
  }

  const removeBook = (bookId) => {
    dispatch({ type: 'REMOVE_BOOK', payload: bookId })
  }

  const updateBookStatus = (bookId, status) => {
    dispatch({ type: 'UPDATE_BOOK_STATUS', payload: { id: bookId, status } })
  }

  const clearSearch = () => {
    dispatch({ type: 'CLEAR_SEARCH' })
  }

  const searchBooks = async (query) => {
    try {
      const result = await searchGoogleBooks(query)
      const booksWithStatus = result.items.map((book) => ({
        ...book,
        status: 'want-to-read',
      }))
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: booksWithStatus })
    } catch (error) {
      console.error('Search failed:', error)
      const mockResults = [
        {
          id: `search-${Date.now()}`,
          title: `Search Result: ${query}`,
          authors: ['Sample Author'],
          description: 'Mock result (API may be unavailable)',
          publishedDate: '2023',
          pageCount: 200,
          imageLinks: {
            thumbnail: 'https://via.placeholder.com/128x192/ff6b6b/ffffff?text=Search',
          },
        },
      ]
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: mockResults })
    }
  }

  // 🧭 Helper functions
  const getBookById = (id) => state.books.find((book) => book.id === id)
  const getBooksByStatus = (status) => state.books.filter((b) => b.status === status)
  const getTotalBooks = () => state.books.length
  const getReadingProgress = () => {
    const completed = state.books.filter((b) => b.status === 'have-read').length
    const total = state.books.length
    return { completed, total }
  }

  const value = {
    // State
    books: state.books,
    searchResults: state.searchResults,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    addBook,
    removeBook,
    updateBookStatus,
    searchBooks,
    clearSearch,

    // Helpers
    getBookById,
    getBooksByStatus,
    getTotalBooks,
    getReadingProgress,
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