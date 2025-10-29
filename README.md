# CodeCaddy - React Router & Context API Assignment

## 📚 Project Overview

You've been provided with a working CodeCaddy book collection application. However, it's currently using simple conditional rendering instead of React Router, and the Context API is missing some important interfaces. Your job is to upgrade this application by implementing React Router for navigation and adding the missing TypeScript-style interfaces to the context.

## 🎯 Learning Objectives

By completing this assignment, you will:
- Implement React Router for single-page application navigation
- Convert button-based navigation to Link components
- Create proper route structure with parameters
- Add missing interfaces to improve code organization
- Understand the relationship between routing and state management

## 🏗️ Current Application Structure

The starter application includes:
- ✅ Basic React components (Navigation, BookSearch, BookCollection, BookDetails)
- ✅ Context API with basic functionality
- ✅ Simple state management with useReducer
- ✅ CSS styling
- ❌ React Router (you need to add this)
- ❌ Missing Context interfaces (you need to add these)

## 📋 Assignment Tasks

### Part 1: Install and Setup React Router

1. **Install React Router DOM**
   ```bash
   npm install react-router-dom
   ```

2. **Import Required Components**
   Add these imports to your `App.jsx`:
   ```jsx
   import { BrowserRouter, Routes, Route } from 'react-router-dom'
   ```

### Part 2: Implement React Router in App.jsx

3. **Replace Conditional Rendering**
   
   Currently, `App.jsx` uses this pattern:
   ```jsx
   const renderCurrentView = () => {
     switch (currentView) {
       case 'search':
         return <BookSearch onBookSelect={setSelectedBook} />
       // ... other cases
     }
   }
   ```

   **Your task:** Replace this with proper React Router setup:
   ```jsx
   <BrowserRouter>
     <Navigation />
     <main className="main-content">
       <Routes>
         <Route path="/" element={<HomePage />} />
         <Route path="/search" element={<SearchPage />} />
         <Route path="/collection" element={<CollectionPage />} />
         <Route path="/book/:id" element={<BookDetailsPage />} />
       </Routes>
     </main>
   </BrowserRouter>
   ```

4. **Create Page Components**
   
   You'll need to create these new page components:
   - `HomePage.jsx` - Welcome screen with quick action buttons
   - `SearchPage.jsx` - Wraps the existing BookSearch component
   - `CollectionPage.jsx` - Wraps the existing BookCollection component  
   - `BookDetailsPage.jsx` - Uses useParams to get book ID and display details

### Part 3: Update Navigation Component

5. **Convert Navigation to Use Link Components**

   Currently, `Navigation.jsx` uses buttons:
   ```jsx
   <button 
     className={currentView === 'home' ? 'nav-link active' : 'nav-link'}
     onClick={() => onNavigate('home')}
   >
     Home
   </button>
   ```

   **Your task:** Convert to Link components:
   ```jsx
   import { Link, useLocation } from 'react-router-dom'
   
   // Use useLocation to determine active link
   const location = useLocation()
   
   <Link 
     to="/" 
     className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
   >
     Home
   </Link>
   ```

### Part 4: Add Missing Context Interfaces

6. **Add BookCollectionState Interface**

   Add this interface to your `BookCollectionContext.jsx`:
   ```jsx
   // TODO: Students need to add this interface
   // interface BookCollectionState {
   //   books: Book[]
   //   isLoading: boolean
   //   error: string | null
   //   searchResults: Book[]
   //   currentlyReading: Book[]
   //   wantToRead: Book[]
   //   haveRead: Book[]
   // }
   ```

7. **Add BookCollectionActions Interface**

   ```jsx
   // TODO: Students need to add this interface
   // interface BookCollectionActions {
   //   addBook: (book: Book) => void
   //   removeBook: (bookId: string) => void
   //   updateBookStatus: (bookId: string, status: BookStatus) => void
   //   searchBooks: (query: string) => Promise<void>
   //   clearSearch: () => void
   // }
   ```

8. **Add BookCollectionHelpers Interface**

   ```jsx
   // TODO: Students need to add this interface
   // interface BookCollectionHelpers {
   //   getBookById: (id: string) => Book | undefined
   //   getBooksByStatus: (status: BookStatus) => Book[]
   //   getTotalBooks: () => number
   //   getReadingProgress: () => { completed: number; total: number }
   // }
   ```

### Part 5: Implement Dynamic Routing

9. **Add Book Details Routing**

   Update your book cards to navigate to individual book pages:
   ```jsx
   import { useNavigate } from 'react-router-dom'
   
   const navigate = useNavigate()
   
   <button 
     onClick={() => navigate(`/book/${book.id}`)}
     className="btn-secondary"
   >
     View Details
   </button>
   ```

10. **Create BookDetailsPage with useParams**

    ```jsx
    import { useParams, useNavigate } from 'react-router-dom'
    import { useBookCollection } from '../context/BookCollectionContext'
    
    function BookDetailsPage() {
      const { id } = useParams()
      const navigate = useNavigate()
      const { getBookById } = useBookCollection()
      
      const book = getBookById(id)
      
      if (!book) {
        return <div>Book not found</div>
      }
      
      return (
        <BookDetails 
          book={book} 
          onBack={() => navigate('/collection')} 
        />
      )
    }
    ```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Google Books API key (optional but recommended)

### Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and add your Google Books API key:
   ```
   VITE_GOOGLE_BOOKS_API_KEY=your_actual_api_key_here
   ```

3. **Get Google Books API Key** (Optional):
   - Go to [Google Cloud Console](https://console.developers.google.com/)
   - Create a new project or select existing project
   - Enable the "Books API" in the Library section
   - Go to Credentials and create an API key
   - Copy your API key to the `.env` file

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

### API Integration Notes
- The app includes basic Google Books API integration
- **With API Key**: Real book search functionality
- **Without API Key**: Fallback to mock search results
- Students will enhance the API integration as part of the assignment

## 🎯 Success Criteria

Your completed application should:
- ✅ Use React Router for all navigation
- ✅ Have working URLs for all pages
- ✅ Include the three missing interfaces in context
- ✅ Support browser navigation (back/forward buttons)
- ✅ Maintain all existing functionality
- ✅ Show active navigation states

## 💡 Helpful Tips

1. **Planning Your Routes:**
   - `/` - HomePage (welcome screen)
   - `/search` - SearchPage (book search)
   - `/collection` - CollectionPage (user's books)
   - `/book/:id` - BookDetailsPage (individual book)

2. **Debugging Router Issues:**
   - Check that all components are properly imported
   - Ensure BrowserRouter wraps your entire app
   - Use browser dev tools to inspect URL changes

3. **Working with useParams:**
   - Remember that useParams returns strings
   - You may need to convert IDs if using numbers

4. **Interface Benefits:**
   - Interfaces help document your code
   - They make your context more maintainable
   - They provide better IDE support (if using TypeScript)

## 📚 Additional Resources

- [React Router Documentation](https://reactrouter.com/)
- [React Context API Guide](https://react.dev/reference/react/useContext)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)

## 🚀 Bonus Challenges (Optional)

If you finish early, try these enhancements:
1. Add a 404 page for invalid routes
2. Implement nested routes for different collection views
3. Add query parameters for search functionality
4. Create a breadcrumb navigation component

Good luck! Remember to test your application thoroughly and ask for help if you get stuck.