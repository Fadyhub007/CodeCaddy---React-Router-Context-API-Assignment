import { useState } from 'react'
import { useBookCollection } from '../context/BookCollectionContext'

function BookSearch({ onBookSelect }) {
  const [searchTerm, setSearchTerm] = useState('')
  const { searchResults, searchBooks, addBook } = useBookCollection()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      await searchBooks(searchTerm)
    }
  }

  const handleAddBook = (book) => {
    addBook(book)
    alert('Book added to your collection!')
  }

  return (
    <div className="book-search">
      <h2>Search for Books</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, author, or ISBN..."
          className="search-input"
        />
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      <div className="search-results">
        {searchResults.length > 0 && (
          <>
            <h3>Search Results</h3>
            <div className="books-grid">
              {searchResults.map((book) => (
                <div key={book.id} className="book-card">
                  <img 
                    src={book.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192/cccccc/ffffff?text=No+Image'} 
                    alt={book.title}
                    className="book-cover"
                  />
                  <div className="book-info">
                    <h4>{book.title}</h4>
                    <p className="book-authors">
                      {book.authors?.join(', ') || 'Unknown Author'}
                    </p>
                    <p className="book-year">{book.publishedDate}</p>
                    <div className="book-actions">
                      <button 
                        onClick={() => onBookSelect(book)}
                        className="btn-secondary"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleAddBook(book)}
                        className="btn-primary"
                      >
                        Add to Collection
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default BookSearch