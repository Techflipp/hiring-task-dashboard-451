# 🧠 TechFlipp Frontend Challenge – Submission Overview By Gouransh Sachdeva

## 🚀 Features & Implementation

This project was built using modern frontend best practices and technologies for a clean, scalable, and responsive application:

* **⚙️ Strong Linting & Formatting**: Added ESLint with strong linting, TypeScript rules, and Prettier integration ensures consistent and high-quality code.
* **🔧 Server Actions (Next.js App Router)**: Server actions are used to handle API interactions securely and efficiently (e.g., updating camera settings).
* **🔄 React Query**: Used for fetching, caching, and updating server state, ensuring a seamless data flow and instant UI feedback.
* **🎨 Tailwind CSS + shadcn/ui**: Utility-first styling using Tailwind CSS, enhanced with accessible and ready-made UI components from shadcn/ui.
* **🛡️ Zod Validation**: Schema-based form and server input validation with Zod to catch errors early and ensure robust data integrity.
* **📝 React Hook Form**: Lightweight and performant form handling with integrated validation and controlled form states.

## 🐛 Known Issues

1.  **Update Camera API – Tags Not Updating**: The `editCameraDetails` server action correctly parses the tags, but the backend does not persist the tag updates.
2.  **Demographics API – Filtering Issue**: The demographics endpoint does not respect filters such as gender, age, and emotion, returning the full dataset regardless of query params.

## 💡 Improvements 

* **✨ UI/UX Enhancements**: The current UI is clean but I can further improved with animations, better visual hierarchy, and responsiveness enhancements.
* **🧪 Testing**: Writing tests using tools like jest, react-testing-library, or cypress for E2E flows.

Looking forward to your review!
