import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Candidature Express IA - Crée ton CV et Lettre de Motivation",
  description: "Génère, corrige et optimise tes CV et lettres de motivation avec l'Intelligence Artificielle en quelques clics.",
  keywords: ["CV", "Lettre de motivation", "IA", "Emploi", "Recrutement", "Candidature"],
  openGraph: {
    title: "Candidature Express IA",
    description: "Le créateur de CV le plus intelligent du marché.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Candidature Express IA",
    description: "Le créateur de CV le plus intelligent du marché.",
  }
};

import { Toaster } from 'react-hot-toast';
import ThemeToggle from "@/components/ThemeToggle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var theme = saved;
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ThemeToggle />
        <Toaster position="bottom-center" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  );
}

