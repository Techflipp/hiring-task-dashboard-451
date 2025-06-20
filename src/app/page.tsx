import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Camera Management Platform | Advanced Analytics & Monitoring",
  description:
    "Manage your camera network and unlock powerful demographic insights with our advanced analytics platform. Real-time monitoring, demographic analytics, and comprehensive camera management.",
  keywords: [
    "camera management",
    "demographic analytics",
    "surveillance system",
    "real-time monitoring",
    "camera network",
    "analytics platform",
    "security cameras",
    "visitor analytics",
  ],
  authors: [{ name: "Smart Camera Platform" }],
  creator: "Smart Camera Platform",
  publisher: "Smart Camera Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://smartcam.com"), // used name for temporary purpose
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Smart Camera Management Platform",
    description:
      "Manage your camera network and unlock powerful demographic insights with our advanced analytics platform.",
    url: "https://smartcam.com", // used name for temporary purpose
    siteName: "Smart Camera Management Platform",
    images: [
      {
        url: "/og-image.jpg", // used for temporary purpose
        width: 1200,
        height: 630,
        alt: "Smart Camera Management Platform Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Smart Camera Management
            <span className="text-blue-600 dark:text-blue-400"> Platform</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Manage your camera network and unlock powerful demographic insights
            with our advanced analytics platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/cameras"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Camera Details
            </Link>
            <Link
              href="/analytics"
              className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Analytics
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
              title: "Camera Management",
              description:
                "Easily manage and monitor your entire camera network from a single dashboard.",
            },
            {
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              title: "Demographic Analytics",
              description:
                "Get detailed insights about visitor demographics and behavior patterns.",
            },
            {
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              title: "Real-time Monitoring",
              description:
                "Monitor your cameras in real-time with advanced security features.",
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={feature.icon}
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using our platform to manage
            their camera networks and gain valuable insights.
          </p>
          <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium transition-colors">
            Start Free Trial
          </button>
        </div>
      </section>
    </div>
  );
}
