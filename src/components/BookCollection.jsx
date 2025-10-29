import { useState } from 'react'
import { useBookCollection } from '../context/BookCollectionContext'

function BookCollection({ onBookSelect }) {
  const { books, removeBook, updateBookStatus, getBooksByStatus } = useBookCollection()
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredBooks = filterStatus === 'all' 
    ? books 
    : getBooksByStatus(filterStatus)

  const handleStatusChange = (bookId, newStatus) => {
    updateBookStatus(bookId, newStatus)
  }

  const handleRemoveBook = (bookId) => {
    if (window.confirm('Are you sure you want to remove this book from your collection?')) {
      removeBook(bookId)
    }
  }

  return (
    <div className="book-collection">
      <div className="collection-header">
        <h2>My Book Collection ({books.length} books)</h2>
        
        <div className="filter-controls">
          <label htmlFor="status-filter">Filter by status:</label>
          <select 
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Books</option>
            <option value="want-to-read">Want to Read</option>
            <option value="currently-reading">Currently Reading</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="empty-collection">
          <p>No books found. Start by searching for books to add to your collection!</p>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => (
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
                
                <div className="book-status">
                  <label htmlFor={`status-${book.id}`}>Status:</label>
                  <select 
                    id={`status-${book.id}`}
                    value={book.status || 'want-to-read'}
                    onChange={(e) => handleStatusChange(book.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="want-to-read">Want to Read</option>
                    <option value="currently-reading">Currently Reading</option>
                    <option value="read">Read</option>
                  </select>
                </div>
                
                <div className="book-actions">
                  <button 
                    onClick={() => onBookSelect(book)}
                    className="btn-secondary"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleRemoveBook(book.id)}
                    className="btn-danger"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BookCollection