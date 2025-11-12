# IDURAR ERP/CRM - Enhanced Edition

Open Source ERP/CRM application built with React, Redux, and Ant Design.

## Recent Improvements

This version includes comprehensive improvements:

### 1. TypeScript Support
- Full TypeScript configuration with strict type checking
- Core type definitions for entities and Redux state
- Gradual migration path from JavaScript

### 2. Performance Optimizations
- Route-based code splitting with React.lazy
- Vendor chunk splitting for better caching
- Performance utility hooks (debounce, throttle)
- Memoized components for reduced re-renders
- Build-time optimizations with Vite

### 3. Error Handling
- Error Boundary component for graceful error recovery
- Centralized API error handling
- Enhanced Axios instance with interceptors
- Comprehensive error notifications

### 4. Modern CSS Architecture
- CSS variables for consistent theming
- Full dark mode support with theme provider
- System preference detection
- Improved Ant Design customizations

### 5. Code Quality Tools
- ESLint with React and TypeScript rules
- Prettier for consistent code formatting
- EditorConfig for cross-editor consistency
- VSCode workspace settings
- Pre-commit script for quality checks

### 6. Build Optimizations
- Bundle size reduction with tree-shaking
- Gzip and Brotli compression
- Bundle analyzer for size monitoring
- Optimized chunk splitting strategy
- Minification with Terser

## Getting Started

### Prerequisites
- Node.js 20.9.0
- npm 10.2.4

### Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Analyze bundle size
npm run build:analyze

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check

# Check dependencies
npm run check-deps
\`\`\`

### Development

The application runs on `http://localhost:3000` by default and proxies API requests to `http://localhost:8888`.

For remote backend:
\`\`\`bash
npm run dev:remote
\`\`\`

### Code Quality

Before committing:
\`\`\`bash
npm run pre-commit
\`\`\`

This runs formatting, linting, and type checking.

### Theme Support

The application includes light and dark mode support:
- Automatically detects system preference
- Manual toggle available in UI
- Persists preference to localStorage
- Full CSS variable system for consistent theming

### Environment Variables

Create a `.env` file:
\`\`\`
VITE_BACKEND_SERVER=http://your-backend-url
\`\`\`

## Project Structure

\`\`\`
src/
├── apps/           # Application layouts and shells
├── components/     # Reusable components
├── context/        # React context providers
├── forms/          # Form components
├── hooks/          # Custom React hooks
├── layout/         # Layout components
├── locale/         # Internationalization
├── modules/        # Feature modules
├── pages/          # Page components
├── redux/          # Redux store and slices
├── router/         # Routing configuration
├── style/          # CSS and styling
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
\`\`\`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Run `npm run pre-commit` before committing
4. Submit a pull request

## Backend Compatibility

All improvements maintain full backward compatibility with the existing backend API. No breaking changes were introduced to API endpoints or data structures.

## License

[Your License Here]

## Support

For commercial customization services, contact: hello@idurarapp.com
