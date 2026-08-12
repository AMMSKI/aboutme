import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: 'Alan Mamulski',
  description: 'Software engineer based in Utah.',
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
    <html lang="en" className={`${quicksand.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-[#cccccc] font-sans">{children}</body>
    </html>
  );
}



