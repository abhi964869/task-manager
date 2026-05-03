import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Linear Flow",
  description: "Modern Team Task Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-background text-foreground min-h-screen flex flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col pt-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
