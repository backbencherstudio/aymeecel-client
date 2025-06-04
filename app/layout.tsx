import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import Script from "next/script";
import Providers from "@/providers/Providers";
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from '@/context/LanguageContext';


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "1525 AI | 500th Anniversary Prophezy | UZH",
  description: "1525 AI | 500th Anniversary Prophezy | UZH",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* icon add */}
      <link rel="icon" href="icon.svg" sizes="any" />
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <LanguageProvider>
          <Providers>
            {children}
          </Providers>
        </LanguageProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
