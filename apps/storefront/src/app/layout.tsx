import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'MYNTRA - Fashion & Lifestyle',
    template: '%s | MYNTRA',
  },
  description:
    'Shop online for the latest fashion trends. Discover clothing, footwear, accessories and more from top brands.',
  keywords: ['fashion', 'clothing', 'online shopping', 'myntra', 'lifestyle'],
  openGraph: {
    title: 'MYNTRA - Fashion & Lifestyle',
    description: 'Shop online for the latest fashion trends.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
