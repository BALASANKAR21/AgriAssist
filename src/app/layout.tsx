import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import { AppProvider } from '@/components/app-provider';
import { cn } from '@/lib/utils';
import { PT_Sans, Noto_Sans_Devanagari } from 'next/font/google';

const pt_sans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

const noto_sans_devanagari = Noto_Sans_Devanagari({
  subsets: ['latin'],
  variable: '--font-hindi',
});

export const metadata: Metadata = {
  title: 'AgriAssist',
  description: 'A Comprehensive, Offline-First, Voice-Enabled Agricultural PWA.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#388E3C',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        pt_sans.variable,
        noto_sans_devanagari.variable
      )}>
        <AppProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
