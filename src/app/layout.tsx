import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/layout/navigation";
import { ConnectionStatus } from "@/components/ui/connection-status";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Camera Management System",
  description: "Manage cameras and view demographic analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="pb-safe">{children}</main>
          </div>
          <ConnectionStatus />
        </Providers>
      </body>
    </html>
  );
}
