"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="p-6 text-red-600 bg-red-100 rounded">
          <h2 className="text-lg font-semibold mb-2">Error:</h2>
          <p>{error.message}</p>
          <button onClick={() => reset()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
            Something went wrong please try Again
          </button>
        </div>
      </body>
    </html>
  );
}
