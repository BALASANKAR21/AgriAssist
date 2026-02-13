"use client";

import Link from "next/link";
import { Sprout, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/voice-ledger", label: "Voice Ledger" },
  { href: "/community-pest-alert", label: "Pest Alerts" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = ({ inSheet = false }: { inSheet?: boolean }) => (
    navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => inSheet && setIsMobileMenuOpen(false)}
        className={cn(
          "font-medium transition-colors hover:text-primary",
          pathname === link.href ? "text-primary" : "text-muted-foreground",
          inSheet && "block text-lg py-3 px-4"
        )}
      >
        {link.label}
      </Link>
    ))
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sprout className="h-7 w-7 text-primary" />
          <span className="font-headline text-xl font-bold text-primary">AgriAssist</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 pt-10">
                <NavLinks inSheet />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
