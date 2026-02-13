"use client";

import Link from "next/link";
import { Sprout, Menu, Languages, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from 'react-i18next';
import { useTheme } from "next-themes";

const navLinks = [
  { href: "/", labelKey: "dashboard" },
  { href: "/voice-ledger", labelKey: "voiceLedger" },
  { href: "/community-pest-alert", labelKey: "pestAlerts" },
  { href: "/disease-detection", labelKey: "diseaseDetection" },
  { href: "/crop-recommender", labelKey: "cropRecommender" },
  { href: "/market-analysis", labelKey: "marketAnalysis" },
  { href: "/schemes", labelKey: "govSchemes" },
  { href: "/fertilizer-calculator", labelKey: "fertilizerCalculator" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const NavLinks = ({ inSheet = false }: { inSheet?: boolean }) => (
    navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => inSheet && setIsMobileMenuOpen(false)}
        className={cn(
          "font-medium transition-colors hover:text-primary",
          pathname === link.href ? "text-primary font-bold" : "text-muted-foreground",
          inSheet && "block text-lg py-3 px-4 border-b"
        )}
      >
        {t(link.labelKey)}
      </Link>
    ))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Sprout className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">AgriAssist</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t('changeLanguage')}>
                <Languages className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('hi')}>
                हिंदी (Hindi)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t('openMenu')}>
                  <Menu className="h-7 w-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-3/4">
                 <Link href="/" className="flex items-center gap-2 p-4 border-b">
                    <Sprout className="h-7 w-7 text-primary" />
                    <span className="text-xl font-bold text-primary">AgriAssist</span>
                </Link>
                <div className="flex flex-col pt-4">
                  <NavLinks inSheet />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
