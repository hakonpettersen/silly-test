import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kampanjebygger',
  description: 'To-trinns kampanjebygger for sosiale medier',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}
