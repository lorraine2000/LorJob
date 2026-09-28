"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

import { UserProvider } from "../components/pages/user-provider";
import { Toaster } from "sonner";
import { Header } from "../components/header";
import { useUserStore } from "../lib/store/user-store";
import OnboardingTour from "../components/OnboardingTour";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/*
export const metadata: Metadata = {
  metadataBase: new URL("https://jobi.io"),
  authors: [{ name: "Lorraine" }],
  creator: "Lorraine",
  icons: {
    icon: "/favicon.ico",
  },
  title: "Jobi",
  description: "Jobi est une plateforme de gestion du suivi de candidatures pour les chercheurs d'emploi.",
};
*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const user = useUserStore((state) => state.value.user);

  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
      >
				<Toaster expand />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {!user && <Header />}
          {children}
        </ThemeProvider>
        <UserProvider />
      </body>
    </html>
  );
}
