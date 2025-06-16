"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="mainPx absolute top-4 h-12 w-full">
      <nav className="max-container flex w-full items-center justify-between">
        <Link
          href={"/"}
          className={`${pathname === "/" ? "hidden" : "inline-block"}`}
        >
          <Button className="rounded-full">
            <ArrowLeft className="rounded-full" />
            <span className="hidden lg:inline">Dashboard</span>
          </Button>
        </Link>
        <h1 className="font-extrabold">TechFlipp</h1>
        <ThemeToggle />
      </nav>
    </header>
  );
}
