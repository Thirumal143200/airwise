import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://airwise-258m.onrender.com"),
  title: "AirWise — Urban Air Quality Intelligence & Family Safety Assistant",
  description:
    "Understand your air. Protect your routine. Make cleaner choices. A GenAI-powered environmental assistant for urban smog and family safety.",
  keywords: [
    "air quality",
    "AQI",
    "smog assistant",
    "indoor air quality",
    "CPCB AQI",
    "sustainable routines",
    "Delhi smog",
    "air pollution",
    "family safety",
  ],
  authors: [{ name: "AirWise Engineering Team" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
  openGraph: {
    title: "AirWise — Urban Air Quality Intelligence & Family Safety Assistant",
    description:
      "Understand your air. Protect your routine. Make cleaner choices. A GenAI-powered environmental assistant for urban smog and family safety.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "AirWise Environmental Intelligence Banner",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f8faf9] text-forest-950 flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
