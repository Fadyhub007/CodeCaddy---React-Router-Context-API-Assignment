import { useParams, useNavigate } from 'react-router-dom'
import { useBookCollection } from '../context/BookCollectionContext'
import BookDetails from '../components/BookDetails'

function BookDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getBookById } = useBookCollection()

  const book = getBookById(id)

  if (!book) {
    return <div>Book not found</div>
  }

  return <BookDetails book={book} onBack={() => navigate('/collection')} />
}

export default BookDetailsPage
