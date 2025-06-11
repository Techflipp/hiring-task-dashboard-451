import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "../../providers/query-provider";
import { Header } from "../../components/layout/header";
import { Footer } from "../../components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechFlipp Camera Management",
  description: "Professional camera management and demographic analytics platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <div className="min-h-screen bg-gray-50">
            <Header/>
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer/>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}