import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Karmic Wellness | Intelligent Journaling for Mind-Body Balance',
  description: 'Transform your journaling experience with AI-powered karma analysis, emotional mapping, and psychosomatic insights for holistic wellness.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}