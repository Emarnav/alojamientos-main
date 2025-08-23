// app/layout.tsx
"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { SidebarProvider } from "@/components/ui/sidebar";
import TestUserSelector from "@/components/TestUserSelector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <Providers>
          <div>
            <SidebarProvider>
              <Navbar />
              <TestUserSelector />
              <main
                className="h-full w-full flex flex-col"
                style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
              >
                {children}
              </main>
            </SidebarProvider>
          </div>
        </Providers>

        <Toaster closeButton />
      </body>
    </html>
  );
}
