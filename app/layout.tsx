import './globals.css';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { ClerkSync } from '@/components/clerk-sync';

export const metadata: Metadata = {
  title: 'SomaJournal | Mindful Journaling & Self-Reflection',
  description: 'Transform your thoughts into meaningful insights with SomaJournal. AI-powered emotional analysis and mindful reflection for deeper self-understanding.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link 
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap" 
            rel="stylesheet" 
          />
        </head>
        <body className="font-sans antialiased">
          <ClerkSync />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}