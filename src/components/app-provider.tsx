"use client";

import { useEffect, type ReactNode, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { ThemeProvider } from 'next-themes';

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(err => {
          console.error('ServiceWorker registration failed: ', err);
          toast({
            variant: "destructive",
            title: "Offline Mode Failed",
            description: "Could not enable offline access. You may have an outdated browser.",
          });
        });
      });
    }
  }, [toast]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </ThemeProvider>
    </Suspense>
  );
}
