import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: 'Alan Mamulski',
  description: 'Full-stack engineer and builder based in Utah.',
  authors: [{ name: 'Alan Mamulski' }],
  icons: [
    { rel: 'icon', url: '/icon.png', type: 'image/png' },
  ],


  openGraph: {
    title: 'Alan Mamulski',
    description: 'Full-stack engineer and builder based in Utah.',
    url: 'https://mamulski.com',
    siteName: 'Alan Mamulski',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 675,
        alt: 'Alan Mamulski — Full-Stack Engineer & Builder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alan Mamulski',
    description: 'Full-stack engineer and builder based in Utah.',
    images: ['/og-image.jpg'],
  },
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



