import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import { AppProvider } from '@/components/app-provider';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'AgriAssist',
  description: 'Your AI-powered assistant for modern farming.',
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#388E3C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col")}>
        <AppProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
