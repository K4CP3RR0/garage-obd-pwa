import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { buttonVariants } from "@/components/ui/button";
import { SignOutButton } from "@/components/sign-out-button";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";

// Cache Components: getSession czyta cookies → nie da się prerenderować.
// Na razie blokujemy instant navigation; później można Suspense + shell.
export const instant = false;

const navLinkClass = cn(buttonVariants({ variant: "ghost" }));

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Link href="/garage" className="font-semibold text-primary">
            Telemetryx
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/garage" className={navLinkClass}>
              Garaż
            </Link>
            <Link href="/import" className={navLinkClass}>
              Import
            </Link>
            <Link href="/sessions" className={navLinkClass}>
              Trasy
            </Link>
            <Link href="/alerts" className={navLinkClass}>
              Alerty
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
      <SiteFooter />
    </div>
  );
}