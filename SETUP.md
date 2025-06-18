# 🚀 Camera Management Dashboard - Setup Instructions

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Application**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The application will automatically connect to the API at `https://task-451-api.ryd.wafaicloud.com/`

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Application Features

### 🎥 Camera Management
- **Cameras List**: `/cameras` - View all cameras with search and pagination
- **Camera Details**: `/cameras/[id]` - View detailed camera information
- **Analytics**: `/analytics` - Demographics analytics dashboard

### 🏠 Home Dashboard
- **Overview**: `/` - Application overview and quick actions

## API Integration

The application connects to the Camera Management API:
- **Base URL**: `https://task-451-api.ryd.wafaicloud.com/`
- **Documentation**: `https://task-451-api.ryd.wafaicloud.com/docs`

All API calls are handled automatically through React Query with caching and error handling.

## Key Features

✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Real-time Search** - Debounced search with instant results  
✅ **Data Visualization** - Analytics with charts and statistics  
✅ **Error Handling** - User-friendly error messages  
✅ **Loading States** - Skeleton loaders for better UX  
✅ **Type Safety** - Full TypeScript implementation  

## Technology Stack

- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Data Fetching**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Charts**: Recharts (ready for implementation)

## Development

The application is built with modern React patterns and Next.js best practices:

- **File-based routing** with App Router
- **Server and client components** appropriately separated
- **Custom hooks** for API operations
- **Reusable components** with consistent styling
- **Optimistic UI updates** for better user experience

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

**API connection issues?**
- Check network connection
- Verify API is accessible at `https://task-451-api.ryd.wafaicloud.com/docs`
- Check browser console for error details

## Next Steps

The application foundation is complete and ready for additional features:

1. **Camera editing forms** - Complete CRUD operations
2. **Demographics configuration** - Full configuration management
3. **Advanced analytics** - Chart visualizations with Recharts
4. **Unit testing** - Jest and React Testing Library
5. **E2E testing** - Playwright integration

Enjoy exploring the Camera Management Dashboard! 🎉 