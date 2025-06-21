"use client";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <html>
      <body>
        <div className="p-6 rounded flex justify-center items-center flex-col min-h-screen">
          <h1 className="text-2xl font-semibold mb-2">404 Not Found</h1>
          <Link className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" href="/">List cameras</Link>
        </div>
      </body>
    </html>
  );
}
