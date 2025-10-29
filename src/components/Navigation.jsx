import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>CodeCaddy</h2>
      </div>

      <div className="nav-links">
        <Link
          to="/"
          className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
        >
          Home
        </Link>

        <Link
          to="/search"
          className={location.pathname === '/search' ? 'nav-link active' : 'nav-link'}
        >
          Search
        </Link>

        <Link
          to="/collection"
          className={location.pathname === '/collection' ? 'nav-link active' : 'nav-link'}
        >
          My Collection
        </Link>
      </div>
    </nav>
  )
}

export default Navigation
