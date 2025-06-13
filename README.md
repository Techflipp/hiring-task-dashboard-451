# Camera Management System

A modern, responsive web application for managing security cameras and analyzing demographic data collected through AI-powered video analytics. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🌟 Features

### Camera Management
- **Real-time Camera Monitoring**: View camera status, snapshots, and connection health
- **CRUD Operations**: Create, read, update, and delete camera configurations
- **Advanced Search**: Search cameras by name with debounced input
- **Pagination**: Customizable page sizes (12, 24, 48 items per page)
- **Tag System**: Organize cameras with color-coded tags
- **Status Indicators**: Visual feedback for active/inactive cameras with error messages

### Demographics Analytics
- **Configuration Management**: Create and edit demographic detection parameters per camera
- **Real-time Analytics**: View demographic insights with interactive charts
- **Visual Analytics**: 
  - Pie charts for gender and ethnicity distribution
  - Bar charts for age and emotion analysis
  - Summary statistics and top metrics
  - Detailed detection tables

### User Experience
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Loading States**: Skeleton loaders for better perceived performance
- **Error Handling**: Graceful error states with fallback UI
- **Image Optimization**: Smart image loading with error handling
- **Optimistic Updates**: Instant UI feedback for better user experience

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15.3.3](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with Tailwind

### State Management & Data Fetching
- **React Query**: [@tanstack/react-query](https://tanstack.com/query/latest) for server state management
- **Form Management**: [React Hook Form](https://react-hook-form.com/) with Zod validation
- **HTTP Client**: [Axios](https://axios-http.com/)

### Visualization & UI
- **Charts**: [Recharts](https://recharts.org/) for data visualization
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

### Development Tools
- **Build Tool**: Next.js with Turbopack
- **Type Checking**: TypeScript
- **Linting**: ESLint with Next.js config
- **Testing**: Jest with React Testing Library

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Git

## 🚀 Getting Started

### Installation
- npm install