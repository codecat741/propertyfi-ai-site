import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GlassHouse Pricing Builder',
  description: 'Interactive pricing calculator for GlassHouse platform services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
