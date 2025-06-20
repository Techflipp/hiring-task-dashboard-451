# Camera Management Dashboard

This is a responsive, full-featured frontend application built with **Next.js 15**, **React 19**, and **React Query**. It allows users to manage cameras and view demographic analytics using a clean and intuitive UI.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sayedbadawy-js/cameras.git
cd cameras


# 2. Install Dependencies
# npm install

# 3. Start the Development Server
# npm run dev

# 4- Visit http://localhost:3000 in your browser.



# Tech Stack
# Next.js 15 – App Router, SSR/CSR blending

# React 19

# @tanstack/react-query – Data fetching & caching

# Axios – HTTP client

# Zod – Schema validation

# Recharts – Data visualization

# Tailwind CSS – Styling

# Lucide-react – Icons

# UUID – Unique identifiers

# TypeScript – Strong typing

# ✅ Features
# 🔹 Camera List
# Pagination

# Search by camera name

# Control items per page

# 🔹 Camera Details
# Full detail view for each camera

# Handles empty/fallback states with loading skeletons

# 🔹 Edit Camera
# Form with validation and error handling

# Populates initial values via SSR, updated with CSR

# 🔹 Demographics Configuration
# One-to-one relationship with each camera

# Create/edit demographic config per camera

# Validated fields with proper ranges and constraints

# 🔹 Analytics Dashboard
# Filters: gender, age, emotion, ethnicity, date range

# Displays results using charts and tables via recharts