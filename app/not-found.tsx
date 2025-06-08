import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h2 className="text-4xl font-bold mb-4">Not Found</h2>
      <p className="text-xl mb-8">The resource you are looking for does not exist.</p>
      <Link href="/" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
        Return Home
      </Link>
    </div>
  )
}
