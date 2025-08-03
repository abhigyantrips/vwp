import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { cn } from '@/lib/utils';

import { Toaster } from '@/components/ui/sonner';

import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'National Service Scheme, MAHE',
  description:
    'A website for the constituent NSS units of Manipal Academy of Higher Education',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'bg-sidebar relative flex min-h-screen flex-col font-sans antialiased',
          geistSans.variable,
          geistMono.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
