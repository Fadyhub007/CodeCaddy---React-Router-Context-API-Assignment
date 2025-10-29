import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BookCollectionProvider } from './context/BookCollectionContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BookCollectionProvider>
      <App />
    </BookCollectionProvider>
  </React.StrictMode>
)
