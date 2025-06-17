# Camera Management Dashboard

A comprehensive Next.js application for managing cameras and viewing demographic analytics data collected by these cameras.

## 🚀 Features

- **Camera Management**
  - View paginated list of cameras
  - Search and filter cameras by name
  - View detailed camera information
  - Update camera settings and configurations

- **Demographics Analytics**
  - Create and edit demographics configuration
  - View detailed analytics with filtering options
  - Interactive charts and visualizations
  - Filter by gender, age, emotion, and ethnicity

- **User Experience**
  - Responsive design for all screen sizes
  - Dark/light theme support
  - Loading states and error handling
  - Optimistic UI updates

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 15 (App Router)
- **UI Components**: Shadcn/ui with Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form with Zod validation
- **Data Visualization**: Chart.js and Recharts
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript

## 📦 Prerequisites

- Node.js (v18 or later)
- npm (v9 or later) or yarn
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hiring-task-dashboard-451
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://task-451-api.ryd.wafaicloud.com
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Build for Production

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

## 🎨 Design Decisions

### Architecture
- **App Router**: Utilized Next.js 13+ App Router for better performance and modern React features
- **Server Components**: Leveraged React Server Components for better initial load performance
- **Client-Side State**: Used React Query for efficient data fetching, caching, and state management

### UI/UX
- **Component Library**: Implemented Shadcn/ui for consistent and accessible UI components
- **Responsive Design**: Fully responsive layout that works on all device sizes
- **Dark Mode**: Added theme support with next-themes
- **Loading States**: Implemented skeleton loading states for better perceived performance

### Performance
- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Used Next.js Image component for optimized image loading
- **Lazy Loading**: Implemented dynamic imports for non-critical components

## 📊 API Integration

The application integrates with the following API endpoints:

- Camera management (`/cameras/*`)
- Demographics configuration (`/demographics/config/*`)
- Demographics results (`/demographics/results`)


