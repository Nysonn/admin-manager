# Admin Panel for Homepage Content Management

A fully functional admin panel built with React and React Admin that enables non-technical users to manage homepage content including pages, images, navigation menus, and external product data integration.

## Live Demo

**Production URL:** [https://admin-manager356.web.app](https://admin-manager356.web.app)

### Demo Credentials
```
Email: admin@example.com
Password: admin123
```

## 📋 Features

### ✅ Completed Requirements

#### 1. Page Management
- ✅ Create, edit, delete, and list pages
- ✅ Multi-line text editor for content creation
- ✅ Page fields: Title, Slug, Content, Publication Status (draft/published)
- ✅ Slug validation to prevent duplicates
- ✅ Live page preview functionality
- ✅ Consistent header and footer structure across all pages

#### 2. Image Management
- ✅ Upload multiple images with drag-and-drop support
- ✅ Replace or delete uploaded images
- ✅ Image gallery view with grid layout
- ✅ Image preview, details, and metadata display
- ✅ Bulk selection and deletion capabilities
- ✅ Copy image URLs for easy embedding
- ✅ Professional skeleton loaders during data fetch

#### 3. Navigation Menu Management
- ✅ Add, edit, delete, and reorder menu items (drag-and-drop)
- ✅ Menu item fields: Label, Link Type (internal/external/none), Page ID, URL, Icon
- ✅ Optional settings: Open in new tab, Show in mobile view
- ✅ Live menu preview page
- ✅ Nested menu support

#### 4. External API Integration (Products Dashboard)
- ✅ Fetch and display products from external API ([Fake Store API](https://fakestoreapi.com))
- ✅ Display product list in professional table format
- ✅ Product fields: Image, Name, Description, Price, Category, Stock Status
- ✅ Search and filter by category
- ✅ Refresh data functionality
- ✅ Pagination support
- ✅ Professional skeleton loaders

### 🎨 Additional Features (Beyond Requirements)

- **Dark Mode Support** - Consistent, professional dark theme throughout
- **Error Boundary** - Graceful error handling with user-friendly messages
- **Loading States** - Professional skeleton loaders on all pages
- **Accessibility (a11y)** - ARIA labels, keyboard navigation, screen reader support
- **Performance Optimizations** - React.memo, lazy loading, code splitting
- **Type Safety** - Full TypeScript implementation with strict types
- **Responsive Design** - Mobile-friendly UI across all pages
- **Form Validation** - Client-side validation with helpful error messages
- **State Management** - Redux Toolkit for global state
- **Data Caching** - React Query for efficient API calls and caching

## 🛠️ Technology Stack

### Frontend Framework & UI
- **React** - Modern React with Hooks
- **React Admin** - Admin panel framework
- **Material-UI (MUI)** - Component library
- **TypeScript** - Type-safe JavaScript

### State Management & Data Fetching
- **Redux Toolkit** - Global state management
- **React Query (TanStack Query)** - Server state management and caching
- **React Admin Data Provider** - API integration layer

### Form Handling & Validation
- **React Hook Form** - Form state management
- **Material-UI TextField** - Multi-line text input for page content

### Routing & Navigation
- **React Router** - Client-side routing

### Build Tools
- **Vite** - Fast development server and build tool
- **TypeScript Compiler** - Type checking

### Deployment
- **Firebase Hosting** - Production deployment

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nysonn/admin-manager.git
   cd admin-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory (or use the existing one):
   ```env
   VITE_API_BASE_URL=https://admin-api-qgh7.onrender.com
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at: **http://localhost:5173**

5. **Login with demo credentials**
   ```
   Email: admin@example.com
   Password: admin123
   ```

## 🏗️ Project Structure

```
admin-manager/
├── src/
│   ├── api/                    # API client and endpoints
│   │   ├── client.ts          # Axios instance with interceptors
│   │   ├── endpoints.ts       # API endpoint definitions
│   │   ├── auth.ts            # Authentication API
│   │   ├── pages.ts           # Pages API
│   │   ├── images.ts          # Images API
│   │   ├── menu.ts            # Menu API
│   │   └── products.ts        # Products API
│   │
│   ├── components/            # Reusable components
│   │   ├── ErrorBoundary.tsx  # Global error handler
│   │   ├── Loading.tsx        # Loading component
│   │   ├── ImageList/         # Image gallery components
│   │   ├── MenuList/          # Menu management components
│   │   ├── PagesList/         # Pages list components
│   │   ├── PagesCreate/       # Page creation components
│   │   ├── PagesEdit/         # Page editing components
│   │   ├── ProductsDashboard/ # Products display components
│   │   ├── Layout/            # Layout components
│   │   └── RichTextInput/     # Multi-line text input wrapper
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts         # Authentication hook
│   │   ├── usePages.ts        # Pages data hook
│   │   ├── useImages.ts       # Images data hook
│   │   ├── useMenu.ts         # Menu data hook
│   │   ├── useProducts.ts     # Products data hook
│   │   └── useAccessibility.ts # Accessibility utilities
│   │
│   ├── pages/                 # Page-level components
│   │   ├── PagePreview.tsx    # Preview individual pages
│   │   └── MenuPreview.tsx    # Preview navigation menu
│   │
│   ├── providers/             # React Admin providers
│   │   ├── authProvider.ts    # Authentication logic
│   │   └── dataProvider.ts    # Data fetching logic
│   │
│   ├── resources/             # React Admin resources
│   │   ├── pages/             # Pages resource
│   │   ├── images/            # Images resource
│   │   ├── menu/              # Menu resource
│   │   └── products/          # Products resource
│   │
│   ├── store/                 # Redux store
│   │   ├── index.ts           # Store configuration
│   │   └── slices/            # Redux slices
│   │
│   ├── types/                 # TypeScript type definitions
│   │   ├── index.ts           # Global types
│   │   └── menu.types.ts      # Menu-specific types
│   │
│   ├── utils/                 # Utility functions
│   │   ├── slugify.ts         # URL slug generator
│   │   └── menuTree.utils.ts  # Menu tree helpers
│   │
│   ├── App.tsx                # Root application component
│   └── main.tsx               # Application entry point
│
├── public/                    # Static assets
├── firebase.json              # Firebase configuration
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies
```

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start development server on localhost:5173

# Building
npm run build            # Build for production

# Type Checking
npm run type-check       # Run TypeScript compiler check

# Deployment
npm run deploy           # Build and deploy to Firebase Hosting
firebase deploy          # Deploy to Firebase (after building)

# Code Quality
npm run lint             # Run ESLint
```

## 🎯 Key Design Decisions

### 1. **React Admin Framework**
   - **Why:** Provides out-of-the-box admin functionality (CRUD operations, routing, authentication)
   - **Benefit:** Rapid development, consistent UI patterns, reduced boilerplate

### 2. **TypeScript**
   - **Why:** Type safety prevents runtime errors and improves developer experience
   - **Benefit:** Better IDE support, self-documenting code, easier refactoring

### 3. **React Query (TanStack Query)**
   - **Why:** Handles server state, caching, and automatic refetching
   - **Benefit:** Reduces API calls, improves performance, handles loading/error states

### 4. **Redux Toolkit**
   - **Why:** Global state management for UI state that needs to be shared
   - **Benefit:** Predictable state updates, time-travel debugging, middleware support

### 5. **Material-UI (MUI)**
   - **Why:** Professional, accessible component library with dark mode support
   - **Benefit:** Consistent design system, responsive by default, extensive documentation

### 6. **Lazy Loading & Code Splitting**
   - **Why:** Reduce initial bundle size for faster page loads
   - **Benefit:** Better performance, improved user experience

### 7. **Error Boundaries**
   - **Why:** Graceful error handling prevents entire app crashes
   - **Benefit:** Better user experience, easier debugging in production

### 8. **Accessibility Features**
   - **Why:** Make the application usable for everyone
   - **Benefit:** ARIA labels, keyboard navigation, screen reader support

## 📱 Features Walkthrough

### Pages Management
1. Navigate to **Pages** in the sidebar
2. Click **Create** to add a new page
3. Fill in Title (auto-generates Slug), Content (rich text editor), and Status
4. Click **Save** to create the page
5. Use **Preview** button to see how the page looks
6. Edit or delete pages from the list view

### Images Management
1. Navigate to **Images** in the sidebar
2. Drag and drop images or click to upload
3. View images in grid or list view
4. Click on an image to preview
5. Use context menu (3 dots) to:
   - Copy URL
   - Download
   - Replace
   - Delete
6. Select multiple images for bulk deletion

### Menu Management
1. Navigate to **Menus** in the sidebar
2. Click **Add Menu Item** to create new menu entries
3. Configure:
   - Label (display text)
   - Link Type (internal page, external URL, or none)
   - Additional options (icon, new tab, mobile visibility)
4. Drag and drop to reorder menu items
5. Click **Preview Menu** to see the live navigation

### Products Dashboard
1. Navigate to **Products** in the sidebar
2. View products fetched from external API
3. Use search bar to filter products
4. Filter by category using dropdown
5. Click **Refresh Data** to reload from API
6. Browse through paginated results

## 🔒 Authentication

The application uses token-based authentication with the following flow:

1. User enters credentials on login page
2. API validates and returns JWT token
3. Token stored in localStorage
4. Token included in all API requests via Axios interceptor
5. Automatic redirect to login on 401 errors

## 🌐 API Integration

### Backend API
- **Base URL:** `https://admin-api-qgh7.onrender.com`
- **Authentication:** JWT Bearer tokens
- **Endpoints:**
  - `POST /api/auth/login` - User authentication
  - `GET /api/pages` - List pages
  - `POST /api/pages` - Create page
  - `PUT /api/pages/:id` - Update page
  - `DELETE /api/pages/:id` - Delete page
  - `GET /api/images` - List images
  - `POST /api/images/upload` - Upload image
  - `GET /api/menu` - Get menu items
  - `PUT /api/menu` - Update menu

### External API (Products)
- **API:** Fake Store API (`https://fakestoreapi.com`)
- **Purpose:** Demonstrate external API integration
- **Endpoint:** `GET /products` - Fetch product catalog

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode** - Consistent dark theme across all pages
- **Loading States** - Professional skeleton loaders
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time validation with helpful hints
- **Keyboard Navigation** - Full keyboard support (ESC, arrows, Enter)
- **Accessibility** - ARIA labels and screen reader support

## 👨‍💻 Author

**Nyson**
- GitHub: [@Nysonn](https://github.com/Nysonn)

## 🙏 Acknowledgments

- React Admin for the excellent admin framework
- Material-UI team for the component library
- Fake Store API for the products data
- React Query for server state management

---
