import Link from "next/link"
import { Camera } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Camera className="h-6 w-6" />
          <span>TechFlipp Camera Management</span>
        </Link>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link href="/" className="hover:underline">
                Cameras
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
