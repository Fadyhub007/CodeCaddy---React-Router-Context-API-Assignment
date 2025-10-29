function BookDetails({ book, onBack }) {
  if (!book) {
    return <div>No book selected</div>
  }

  return (
    <div className="book-details">
      <button onClick={onBack} className="back-button">
        ← Back to Collection
      </button>
      
      <div className="book-details-content">
        <div className="book-details-image">
          <img 
            src={book.imageLinks?.thumbnail || 'https://via.placeholder.com/200x300/cccccc/ffffff?text=No+Image'} 
            alt={book.title}
            className="book-cover-large"
          />
        </div>
        
        <div className="book-details-info">
          <h1>{book.title}</h1>
          <p className="book-authors">
            by {book.authors?.join(', ') || 'Unknown Author'}
          </p>
          
          <div className="book-meta">
            <p><strong>Published:</strong> {book.publishedDate || 'Unknown'}</p>
            <p><strong>Pages:</strong> {book.pageCount || 'Unknown'}</p>
            {book.publisher && <p><strong>Publisher:</strong> {book.publisher}</p>}
            {book.categories && (
              <p><strong>Categories:</strong> {book.categories.join(', ')}</p>
            )}
          </div>
          
          {book.description && (
            <div className="book-description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>
          )}
          
          <div className="book-actions">
            <button className="btn-primary">
              Update Status
            </button>
            <button className="btn-secondary">
              Add Review
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetails