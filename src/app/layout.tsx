import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
