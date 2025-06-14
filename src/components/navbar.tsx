import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from './ui/button'
import { ToggleTheme } from './toggle-theme'

export const Navbar = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <Button
        variant="outline"
        className="mb-6 w-fit"
        asChild
      >
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Back to Cameras
        </Link>
      </Button>

      <ToggleTheme />
    </div>
  )
}
