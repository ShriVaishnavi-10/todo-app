import React from "react";
import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/components/Provider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Momentum | Professional Productivity",
  description: "A high-precision workspace for focused management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${inter.variable} font-sans antialiased`}
      >
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
