"use client";
import Link from "next/link";
import { useState } from "react";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed top-6 left-6 z-[200]">
      <button
        className="w-12 h-12 flex flex-col justify-center items-center bg-zinc-900 border-2 border-pink-400 rounded-full shadow-lg hover:bg-zinc-800 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open menu"
      >
        <span className="block w-7 h-1 bg-pink-400 rounded mb-1"></span>
        <span className="block w-7 h-1 bg-pink-400 rounded mb-1"></span>
        <span className="block w-7 h-1 bg-pink-400 rounded"></span>
      </button>
      {open && (
        <div className="absolute top-14 left-0 bg-zinc-900 border-2 border-pink-400 rounded-xl shadow-xl p-6 min-w-[180px] flex flex-col gap-4 animate-fadein">
          <Link
            href="/"
            className="text-lg font-bold text-pink-400 hover:text-yellow-400 transition-colors"
            onClick={() => setOpen(false)}
          >
            Home Page
          </Link>
          <Link
            href="/demographics-analysis"
            className="text-lg font-bold text-pink-400 hover:text-yellow-400 transition-colors"
            onClick={() => setOpen(false)}
          >
            Demographic Result Analysis
          </Link>
        </div>
      )}
    </div>
  );
}
