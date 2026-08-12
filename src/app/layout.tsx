import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Alan Mamulski',
  description: 'Full-stack engineer and builder based in Utah.',
  authors: [{ name: 'Alan Mamulski' }],
  icons: [
    { rel: 'icon', url: '/icon.svg', type: 'image/svg+xml' },
  ],
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-[#cccccc]">{children}</body>
    </html>
  );
}

