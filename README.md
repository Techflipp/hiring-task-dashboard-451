SETUP INSTRUCTIONS

Prerequisite :- 
 1. NodeJs v20+ installed in your system.
 2. npm installed in your system.

STEPS :-
 1. Navigate to root directory of the folder.
 2. Run the command "npm install" to install all the dependencies.
 3. Run the command "npm run dev" to start the application in development mode.

 
🚀 Overview of My Implementation
This project implements a responsive camera management dashboard using the following stack:

Next.js 13 App Router

Tailwind CSS + ShadCN UI (Radix + Tailwind)

React Hook Form + Zod for forms & validation

TanStack React Query for data fetching & cache

Axios for typed API interaction

Jest + Testing Library for unit tests

Toaster for global notifications

nprogress for route change loading indicator

✅ Key Features Implemented:
Camera List Page

Paginated list of all cameras with snapshot, tags, and status

Search and per-page selection

Navigation to camera details on card click

Camera Detail Page

Full camera info with status, tags, stream details

Navigation to edit and demographics config

Camera Edit Page

Edit RTSP URL and streaming parameters

Zod-based validation with inline error display

Demographics Configuration Form

Create or update demographics config for camera

Zod validation with min/max range constraints

Demographics Analytics Dashboard

Filterable by gender, age, emotion, and dates

Charts for gender, emotion, age, and ethnicity breakdowns

Data table for individual items

Clear filters option

🧠 Assumptions & Design Decisions
UI: Used ShadCN UI for consistent component styling and a clean look.

Forms: Used react-hook-form with Zod for performance and scalable form handling.

Pagination: Implemented client-side pagination based on API metadata.

Charts: Used recharts to display demographics analytics clearly.

Responsiveness: Optimized layout to work well on both desktop and mobile.

Routing: Each camera has dedicated routes for details, edit, and configure.

Validation: All numeric fields follow backend min/max rules via Zod schema.

Testing: Jest-based unit tests cover key reusable components like CameraCard.

