"use client";

import { useEffect, type ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export function AppProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
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

  return <>{children}</>;
}
