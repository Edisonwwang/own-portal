import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Portal",
  description: "Single-user life portal skeleton",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Portal"
  },
  other: {
    "mobile-web-app-capable": "yes"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
