import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Providers from "@/providers/Providers";
import { Toaster } from 'react-hot-toast';


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <div id="google_translate_element" style={{ display: "hidden" }}></div>

        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,de',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>

        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />


        <Providers>
          {children}
        </Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
