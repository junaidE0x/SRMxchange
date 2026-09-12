import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { CustomCursor } from '@/components/custom-cursor';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
  title: 'SRMxchange — SRM KTR Student Resource Exchange',
  description: 'Exchange smarter, study better. The marketplace for SRM Kattankulathur students.',
  openGraph: {
    title: 'SRMxchange — SRM KTR Student Resource Exchange',
    description: 'Exchange smarter, study better. The marketplace for SRM Kattankulathur students.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <CustomCursor />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: 'glass-strong border border-white/10 text-foreground',
            },
          }}
        />
      </body>
    </html>
  );
}
