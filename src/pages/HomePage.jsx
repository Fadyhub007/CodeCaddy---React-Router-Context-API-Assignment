import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="home-view">
      <h1>Welcome to CodeCaddy</h1>
      <p>Your personal book collection manager</p>
      <div className="quick-actions">
        <Link to="/search" className="btn-primary">Search Books</Link>
        <Link to="/collection" className="btn-secondary">View Collection</Link>
      </div>
    </div>
  )
}

export default HomePage
