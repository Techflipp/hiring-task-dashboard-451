import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from '@/components/Providers/ClientProviders';
import Header from '@/components/Layout/Header';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Camera Analytics Dashboard",
  description: "Comprehensive camera management and demographics analytics platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <Header />
          <main>
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}
