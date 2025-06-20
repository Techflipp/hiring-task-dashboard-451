import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HamburgerMenu from "../components/HamburgerMenu";
import ReactQueryProvider from "../providers/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Camera Dashboard | Modern Camera Analytics",
  description:
    "A modern, responsive dashboard for managing cameras and analyzing demographics with real-time data.",
  openGraph: {
    title: "Camera Dashboard | Modern Camera Analytics",
    description:
      "A modern, responsive dashboard for managing cameras and analyzing demographics with real-time data.",
    type: "website",
  },
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
        <ReactQueryProvider>
          <HamburgerMenu />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
