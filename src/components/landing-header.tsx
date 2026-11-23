"use client";

import Link from "next/link";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SignOutButton } from "@/components/sign-out-button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Strona główna" },
  { href: "/garage", label: "Garaż" },
  { href: "/#funkcje", label: "Funkcje" },
] as const;

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const userName = session?.user?.name ?? session?.user?.email ?? null;

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4">
        <Link
          href="/"
          className="shrink-0 text-xl font-semibold text-primary"
        >
          Telemetryx
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              {link.label}
            </Link>
          ))}
          {isPending ? null : userName ? (
            <>
              <span className="px-2 text-sm text-muted-foreground">
                {userName}
              </span>
              <Link
                href="/garage"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                Do garażu
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Zaloguj się
            </Link>
          )}
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
                {userName ? (
                  <p className="mb-2 px-3 text-sm text-muted-foreground">
                    Zalogowano:{" "}
                    <span className="font-medium text-foreground">
                      {userName}
                    </span>
                  </p>
                ) : null}
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "justify-start",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 space-y-2 border-t pt-4">
                  {userName ? (
                    <>
                      <Link
                        href="/garage"
                        onClick={() => setOpen(false)}
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "w-full",
                        )}
                      >
                        Do garażu
                      </Link>
                      <SignOutButton />
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full",
                      )}
                    >
                      Zaloguj się
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
