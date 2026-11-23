"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SignOutButton } from "@/components/sign-out-button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/garage", label: "Garaż" },
  { href: "/import", label: "Import" },
  { href: "/sessions", label: "Trasy" },
  { href: "/alerts", label: "Alerty" },
] as const;

const navLinkClass = cn(buttonVariants({ variant: "ghost" }));

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="shrink-0 font-semibold text-primary">
          Telemetryx
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                navLinkClass,
                pathname.startsWith(link.href) &&
                  "bg-accent text-accent-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          <SignOutButton />
        </nav>

        <div className="md:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Otwórz menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="right" className="w-[min(100%,20rem)] p-0">
              <SheetHeader className="border-b p-4 text-left">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start",
                      pathname.startsWith(link.href) &&
                        "bg-accent text-accent-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 border-t pt-4">
                  <SignOutButton />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
