"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

interface LoadingContextValue {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextValue | undefined>(
  undefined
);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<{
    isLoading: boolean;
    message?: string;
  }>({
    isLoading: false,
  });

  const showLoading = (message?: string) => {
    setLoading({ isLoading: true, message });
  };

  const hideLoading = () => {
    setLoading({ isLoading: false });
  };

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      <LoadingOverlay
        isLoading={loading.isLoading}
        message={loading.message}
        className="fixed"
      />
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}
