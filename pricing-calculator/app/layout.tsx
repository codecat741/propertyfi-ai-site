import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PropertyFi Pricing Builder',
  description: 'Interactive pricing calculator for PropertyFi platform services',
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
