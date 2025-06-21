import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../lib/queryClient";

export const metadata: Metadata = {
  title: "Tech Flipp",
  description: "hiring-task-dashboard-451",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastContainer />
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>{" "}
      </body>
    </html>
  );
}
