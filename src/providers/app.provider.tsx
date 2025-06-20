"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { start, done } from "nprogress";
import "nprogress/nprogress.css";
import "../styles/npprogress.css";
import { Toaster } from "sonner";
import { ReactQueryProvider } from "@/lib/react-query.provider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    start();
    const timer = setTimeout(() => {
      done();
    }, 300);

    return () => {
      clearTimeout(timer);
      done();
    };
  }, [pathname]);

  return (
    <>
      <ReactQueryProvider>{children}</ReactQueryProvider>
      <Toaster position="top-right" richColors />
    </>
  );
};
