# 📚 Google Books API Integration Guide

## 🗝️ Complete API Key Setup

### Detailed Step-by-Step Process

#### Step 1: Google Cloud Console Access
1. **Navigate to Google Cloud Console**
   - Go to [console.cloud.google.com](https://console.cloud.google.com/)
   - Sign in with your Google account
   - Accept terms of service if prompted

#### Step 2: Create or Select Project
1. **Create New Project** (if needed):
   - Click the project dropdown at the top
   - Click "New Project"
   - Enter project name: "CodeCaddy" (or your preference)
   - Click "Create"
   
2. **Select Existing Project**:
   - Use the project dropdown to select your project
   - Ensure you're in the correct project context

#### Step 3: Enable Google Books API
1. **Navigate to API Library**:
   - In the left sidebar, click "APIs & Services"
   - Click "Library"
   
2. **Find and Enable Books API**:
   - Search for "Books API" in the search bar
   - Click on "Books API" from the results
   - Click the blue "Enable" button
   - Wait for the API to be enabled (may take a few moments)

#### Step 4: Create API Key
1. **Go to Credentials**:
   - In the left sidebar, click "APIs & Services" > "Credentials"
   
2. **Create Credentials**:
   - Click "Create Credentials" button
   - Select "API Key" from the dropdown
   - Your API key will be generated and displayed

3. **Copy Your API Key**:
   - Copy the generated API key immediately
   - Store it securely (you'll need it for your app)

#### Step 5: Secure Your API Key (Optional but Recommended)
1. **Restrict API Key**:
   - Click "Restrict Key" on the API key popup
   - Or click the edit icon next to your API key in the credentials list

2. **Set API Restrictions**:
   - Under "API restrictions", select "Restrict key"
   - Choose "Books API" from the list
   - Click "Save"

3. **Set Application Restrictions** (Optional):
   - For development: Select "None"
   - For production: Set HTTP referrers or IP addresses

## 🔧 API Integration Implementation

### Environment Setup

#### Create Environment File
```bash
# In your project root, create .env.local
touch .env.local
```

#### Add API Key to Environment
```env
# .env.local
VITE_GOOGLE_BOOKS_API_KEY=your_actual_api_key_here

# Optional: Set API base URL
VITE_GOOGLE_BOOKS_BASE_URL=https://www.googleapis.com/books/v1
```

#### Update .gitignore
```gitignore
# Environment variables
.env.local
.env*.local

# API keys and secrets
*.key
config/secrets.json
```

### TypeScript Type Definitions

#### Complete API Response Types
```typescript
// src/types/api.ts

// Main API response structure
export interface GoogleBooksResponse {
  kind: string;
  totalItems: number;
  items?: GoogleBookItem[];
}

// Individual book item from API
export interface GoogleBookItem {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  saleInfo?: SaleInfo;
  accessInfo?: AccessInfo;
  searchInfo?: SearchInfo;
}

// Detailed volume information
export interface VolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: IndustryIdentifier[];
  readingModes?: ReadingModes;
  pageCount?: number;
  printType?: string;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  maturityRating?: string;
  allowAnonLogging?: boolean;
  contentVersion?: string;
  panelizationSummary?: PanelizationSummary;
  imageLinks?: ImageLinks;
  language?: string;
  previewLink?: string;
  infoLink?: string;
  canonicalVolumeLink?: string;
}

// Image links for book covers
export interface ImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;
}

// Additional supporting interfaces
export interface IndustryIdentifier {
  type: string;
  identifier: string;
}

export interface ReadingModes {
  text: boolean;
  image: boolean;
}

export interface PanelizationSummary {
  containsEpubBubbles: boolean;
  containsImageBubbles: boolean;
}

export interface SaleInfo {
  country: string;
  saleability: string;
  isEbook: boolean;
  listPrice?: Price;
  retailPrice?: Price;
  buyLink?: string;
  offers?: Offer[];
}

export interface Price {
  amount: number;
  currencyCode: string;
}

export interface Offer {
  finskyOfferType: number;
  listPrice: Price;
  retailPrice: Price;
  giftable: boolean;
}

export interface AccessInfo {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: Epub;
  pdf: Pdf;
  webReaderLink: string;
  accessViewStatus: string;
  quoteSharingAllowed: boolean;
}

export interface Epub {
  isAvailable: boolean;
  acsTokenLink?: string;
}

export interface Pdf {
  isAvailable: boolean;
  acsTokenLink?: string;
}

export interface SearchInfo {
  textSnippet: string;
}

// API Error Response
export interface GoogleBooksError {
  error: {
    code: number;
    message: string;
    errors: Array<{
      message: string;
      domain: string;
      reason: string;
    }>;
  };
}

// Search parameters
export interface SearchParams {
  q: string;                    // Search query
  startIndex?: number;          // Pagination offset
  maxResults?: number;          // Number of results (max 40)
  orderBy?: 'newest' | 'relevance';
  printType?: 'all' | 'books' | 'magazines';
  projection?: 'full' | 'lite';
  langRestrict?: string;        // Language code
  subject?: string;             // Subject category
}
```

### API Service Implementation

#### Complete API Service
```typescript
// src/services/googleBooksApi.ts

import type { 
  GoogleBooksResponse, 
  GoogleBooksError, 
  SearchParams 
} from '../types/api';

class GoogleBooksApiService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_GOOGLE_BOOKS_BASE_URL || 
                   'https://www.googleapis.com/books/v1';
    this.apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
    
    if (!this.apiKey) {
      throw new Error('Google Books API key is required');
    }
  }

  /**
   * Search for books using the Google Books API
   */
  async searchBooks(params: SearchParams): Promise<GoogleBooksResponse> {
    const url = this.buildSearchUrl(params);
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData: GoogleBooksError = await response.json();
        throw new Error(
          errorData.error?.message || 
          `API request failed with status ${response.status}`
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while fetching books');
    }
  }

  /**
   * Get a specific book by ID
   */
  async getBookById(bookId: string): Promise<GoogleBookItem> {
    const url = `${this.baseUrl}/volumes/${bookId}?key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData: GoogleBooksError = await response.json();
        throw new Error(
          errorData.error?.message || 
          `Failed to fetch book with ID ${bookId}`
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Unknown error occurred while fetching book ${bookId}`);
    }
  }

  /**
   * Build search URL with parameters
   */
  private buildSearchUrl(params: SearchParams): string {
    const url = new URL(`${this.baseUrl}/volumes`);
    
    // Add API key
    url.searchParams.append('key', this.apiKey);
    
    // Add search parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
    
    return url.toString();
  }

  /**
   * Build search query with filters
   */
  static buildSearchQuery(
    searchTerm: string, 
    filters?: {
      author?: string;
      subject?: string;
      publisher?: string;
      isbn?: string;
    }
  ): string {
    let query = searchTerm;
    
    if (filters) {
      if (filters.author) {
        query += `+inauthor:${filters.author}`;
      }
      if (filters.subject) {
        query += `+subject:${filters.subject}`;
      }
      if (filters.publisher) {
        query += `+inpublisher:${filters.publisher}`;
      }
      if (filters.isbn) {
        query += `+isbn:${filters.isbn}`;
      }
    }
    
    return query;
  }
}

// Export singleton instance
export const googleBooksApi = new GoogleBooksApiService();

// Export class for testing or custom instances
export { GoogleBooksApiService };
```

## 🎯 Usage Examples

### Basic Book Search
```typescript
// Search for programming books
const searchBooks = async () => {
  try {
    const response = await googleBooksApi.searchBooks({
      q: 'javascript programming',
      maxResults: 10,
      orderBy: 'relevance'
    });
    
    console.log(`Found ${response.totalItems} books`);
    response.items?.forEach(book => {
      console.log(book.volumeInfo.title);
    });
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

### Advanced Search with Filters
```typescript
// Search with specific filters
const advancedSearch = async () => {
  const query = GoogleBooksApiService.buildSearchQuery(
    'react',
    {
      author: 'dan abramov',
      subject: 'programming'
    }
  );
  
  const response = await googleBooksApi.searchBooks({
    q: query,
    maxResults: 20,
    orderBy: 'newest'
  });
  
  return response.items || [];
};
```

### Get Specific Book
```typescript
// Get book details by ID
const getBookDetails = async (bookId: string) => {
  try {
    const book = await googleBooksApi.getBookById(bookId);
    console.log('Book details:', book.volumeInfo);
    return book;
  } catch (error) {
    console.error('Failed to get book details:', error);
  }
};
```

## 🚨 Error Handling Patterns

### API Error Types
```typescript
// src/types/errors.ts

export type ApiErrorType = 
  | 'NETWORK_ERROR'
  | 'API_KEY_INVALID'
  | 'RATE_LIMIT_EXCEEDED'
  | 'BOOK_NOT_FOUND'
  | 'INVALID_QUERY'
  | 'UNKNOWN_ERROR';

export interface ApiError {
  type: ApiErrorType;
  message: string;
  originalError?: Error;
}

export class BookSearchError extends Error {
  constructor(
    public readonly type: ApiErrorType,
    message: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'BookSearchError';
  }
}
```

### Error Handling in Components
```typescript
// Example error handling in a React component
const BookSearch: React.FC = () => {
  const [error, setError] = useState<ApiError | null>(null);
  
  const handleSearch = async (query: string) => {
    try {
      setError(null);
      const results = await googleBooksApi.searchBooks({ q: query });
      // Handle results...
    } catch (err) {
      if (err instanceof Error) {
        setError({
          type: 'UNKNOWN_ERROR',
          message: err.message,
          originalError: err
        });
      }
    }
  };
  
  return (
    <div>
      {error && (
        <div className="error-message">
          Error: {error.message}
        </div>
      )}
      {/* Rest of component */}
    </div>
  );
};
```

## 📊 API Limits and Best Practices

### Rate Limits
- **Free Tier**: 1,000 requests per day
- **Per User**: 100 requests per 100 seconds
- **Burst Limit**: 10 requests per second

### Best Practices
1. **Cache Results**: Store search results to reduce API calls
2. **Debounce Searches**: Wait for user to finish typing
3. **Pagination**: Load results in chunks
4. **Error Recovery**: Implement retry logic for failed requests
5. **Loading States**: Always show loading indicators

### Example Implementation
```typescript
// Custom hook with caching and debouncing
export const useGoogleBooks = () => {
  const [cache, setCache] = useState<Map<string, GoogleBooksResponse>>(new Map());
  const [loading, setLoading] = useState(false);
  
  const searchBooks = useMemo(
    () => debounce(async (query: string) => {
      if (cache.has(query)) {
        return cache.get(query)!;
      }
      
      setLoading(true);
      try {
        const result = await googleBooksApi.searchBooks({ q: query });
        setCache(prev => new Map(prev).set(query, result));
        return result;
      } finally {
        setLoading(false);
      }
    }, 300),
    [cache]
  );
  
  return { searchBooks, loading };
};
```

## 🔍 Testing Your API Integration

### Test Checklist
- [ ] API key works correctly
- [ ] Search returns proper results
- [ ] Error handling works for invalid queries
- [ ] Rate limiting is respected
- [ ] Results are properly typed
- [ ] Loading states function correctly

### Example Test Queries
```typescript
// Test different types of searches
const testQueries = [
  'javascript',                    // Simple search
  'author:martin fowler',          // Author search
  'subject:programming',           // Subject search
  'isbn:9781449331818',           // ISBN search
  'intitle:react',                // Title search
  'inpublisher:oreilly'           // Publisher search
];
```

This comprehensive guide should help you successfully integrate the Google Books API into your CodeCaddy project! 📚🚀