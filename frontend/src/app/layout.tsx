import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { AuthProvider } from "@/context/AuthContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopWave",
  description: "Modern ecommerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_34%),linear-gradient(180deg,_#07111f_0%,_#0f172a_100%)] text-slate-100 bg-fixed bg-no-repeat">

        <AuthProvider>

          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />

        </AuthProvider>

      </body>
    </html>
  );
}