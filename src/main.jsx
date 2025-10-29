import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BookCollectionProvider } from './context/BookCollectionContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BookCollectionProvider>
      <App />
    </BookCollectionProvider>
  </React.StrictMode>,
)