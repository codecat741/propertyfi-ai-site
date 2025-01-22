import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PropertyFi - AI-Powered Real Estate Technology',
  description: 'Transform your real estate portfolio with AI-driven insights and automation.',
  keywords: 'real estate, AI, property technology, proptech, real estate investment',
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