import { Camera } from "lucide-react";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <Camera className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Camera Dashboard
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-4 text-sm font-medium">
            <Link href="/cameras" className="text-muted-foreground/70 transition-colors hover:text-muted-foreground">
              Cameras
            </Link>
            <Link href="/demographics" className="text-muted-foreground/70 transition-colors hover:text-muted-foreground">
              Demographics
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
