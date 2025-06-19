# Camera Management Dashboard

A comprehensive Next.js application for managing cameras and viewing demographic analytics data. This dashboard provides an intuitive interface for camera configuration, demographic tracking setup, and data visualization.

## Features

### ✅ Core Functionality

- **Camera Management**: List, view, and edit camera configurations
- **Demographics Configuration**: Set up tracking parameters for demographic analysis
- **Analytics Dashboard**: Visualize demographic data with charts and filters
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

### 🎨 UI/UX Features

- Modern, clean interface with Tailwind CSS
- Skeleton loading states for better perceived performance
- Form validation with meaningful error messages
- Optimistic UI updates for enhanced user experience
- Intuitive navigation and user flows

### 🔧 Technical Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **React Query (TanStack Query)** for data fetching and caching
- **React Hook Form** with Zod validation
- **Recharts** for data visualization
- **Lucide React** for consistent icons
- **Unit Testing** with Jest and React Testing Library

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd hiring-task-dashboard-451
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── cameras/           # Camera management pages
│   ├── demographics/      # Demographics configuration
│   ├── analytics/         # Analytics dashboard
│   ├── settings/          # System settings
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── providers.tsx     # React Query provider
├── lib/                  # Utility functions and API
│   ├── api.ts           # API client and types
│   └── utils.ts         # Helper functions
└── __tests__/           # Unit tests
```

## API Integration

The application integrates with the Camera Management API:

- **Base URL**: `https://task-451-api.ryd.wafaicloud.com/`
- **Documentation**: `https://task-451-api.ryd.wafaicloud.com/docs`

### Key Endpoints

- `GET /cameras/` - List cameras with pagination and search
- `GET /cameras/{id}` - Get camera details
- `PUT /cameras/{id}` - Update camera configuration
- `POST /demographics/config` - Create demographics configuration
- `PUT /demographics/config/{id}` - Update demographics configuration
- `GET /demographics/results` - Get analytics data with filters

## Implementation Details

### State Management

- **React Query** for server state management
- **React Hook Form** for form state
- **Zod** for schema validation

### Data Fetching

- Optimistic updates for better UX
- Automatic background refetching
- Error handling with retry logic
- Loading states and skeleton screens

### Form Validation

- Client-side validation with Zod schemas
- Real-time error feedback
- Type-safe form handling

### Charts and Visualizations

- **Recharts** for responsive charts
- Multiple chart types (Bar, Pie, Line)
- Interactive tooltips and legends
- Filtered data visualization

## Testing

The project includes comprehensive unit tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure

- Component testing with React Testing Library
- API mocking with Jest
- Accessibility testing
- User interaction testing

## Design Decisions

### Architecture

- **App Router**: Modern Next.js routing for better performance
- **Component Composition**: Reusable UI components with variants
- **Type Safety**: Full TypeScript implementation
- **API Layer**: Centralized API client with type definitions

### Performance

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js built-in image optimization
- **Caching**: React Query for intelligent data caching
- **Bundle Optimization**: Tree shaking and dead code elimination

### Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open an issue in the repository.
