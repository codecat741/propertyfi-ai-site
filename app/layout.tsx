import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PropertyFi - AI-Powered Lead Generation for Property Services',
  description: 'Our AI analyzes high-resolution aerial and ground-level imagery to identify property improvement opportunities with 86% accuracy—delivering actionable insight directly to service providers.',
  keywords: 'property services, AI lead generation, roofing leads, property maintenance, restoration leads, artificial turf leads',
  openGraph: {
    title: 'PropertyFi - AI-Powered Lead Generation for Property Services',
    description: 'Our AI analyzes high-resolution aerial and ground-level imagery to identify property improvement opportunities with 86% accuracy—delivering actionable insight directly to service providers.',
    images: [
      {
        url: '/images/tech/property-analysis.jpg',
        width: 1200,
        height: 630,
        alt: 'AI-powered property analysis visualization',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropertyFi - AI-Powered Lead Generation for Property Services',
    description: 'Our AI analyzes high-resolution aerial and ground-level imagery to identify property improvement opportunities with 86% accuracy—delivering actionable insight directly to service providers.',
    images: ['/images/tech/property-analysis.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <Navigation />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}