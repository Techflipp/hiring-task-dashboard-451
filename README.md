# 📸 CameraVision Analytics

Welcome to **CameraVision Analytics**! This is an advanced camera management and demographics analytics platform designed to help you monitor your cameras and analyze real-time demographic data. Built with Next.js, React, and Tailwind CSS, it offers a sleek, responsive, and intuitive user experience.

## ✨ Features

*   **Dashboard**: Get a quick overview of your system with key statistics and recent activity.
*   **Camera Management**:
    *   **List Cameras**: View all your cameras with their status (online/offline) and configuration presence.
    *   **Add New Camera**: Easily add new cameras with detailed stream settings and tags.
    *   **View Camera Details**: Dive deep into individual camera configurations, status, and associated demographics settings.
    *   **Edit Camera**: Update camera details and stream parameters.
*   **Demographics Configuration**: Configure advanced settings for demographics detection on a per-camera basis.
*   **Demographics Analytics**:
    *   **Interactive Dashboard**: Visualize demographic data (gender, age, emotion, ethnicity) through various charts (Pie, Bar, Line).
    *   **Detailed Records Table**: View individual detection records with timestamps and confidence levels.
    *   **Advanced Filtering**: Filter analytics data by camera, gender, age, emotion, ethnicity, and date range.
*   **System Settings**: Customize application preferences, notifications, security, and system behavior, with settings persisting in local storage.
*   **Responsive Design**: Optimized for seamless experience across various devices (desktop, tablet, mobile).
*   **Toast Notifications**: Provides clear feedback for user actions (success, error, validation).
*   **Client-Side Data Fetching**: Utilizes React Query for efficient data management, caching, and synchronization.
*   **API Simulation & Persistence**: The API client includes dummy data and local storage integration to simulate backend operations (CRUD for cameras and demographics configs) for a full-stack feel without a real backend.

## 🚀 Technologies Used

*   **Next.js**: React framework for production.
*   **React**: A JavaScript library for building user interfaces.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **shadcn/ui**: Beautifully designed components built with Radix UI and Tailwind CSS.
*   **Lucide React**: A collection of beautiful & consistent icons.
*   **React Query (TanStack Query)**: Powerful asynchronous state management for React.
*   **Recharts**: A composable charting library built on React components.

## 🛠️ Project Setup

Follow these steps to get the CameraVision Analytics project up and running on your local machine.

### Prerequisites

Make sure you have the following installed:

*   **Node.js**: Version 18.x or higher (LTS recommended). You can download it from [nodejs.org](https://nodejs.org/).
*   **npm** (comes with Node.js) or **Yarn** or **pnpm**.


### Installation

1. **Clone the repository**
   ```sh
   git clone <repository-url>
   cd reactflow-example

2. **Install dependencies**
   ```sh
   npm install
   # or if using yarn
   yarn install

3. **Start the development server**
   ```sh
   npm run dev
   # or
   yarn dev

4. **Build for production**
   ```sh
   npm run build
   # or
   yarn build

5. **Preview the production build**
   ```sh
   npm run preview
   # or
   yarn preview