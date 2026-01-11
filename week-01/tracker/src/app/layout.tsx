import type { Metadata, Viewport } from "next";
import { Cinzel, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Omnissiah Protocol | Sacred Rites of AI Fluency",
  description: "Track the 10 Sacred Rites on your path to machine enlightenment",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Omnissiah Protocol",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${cinzel.variable} ${shareTechMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
