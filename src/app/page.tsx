import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { LandingHeader } from "@/components/landing-header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader />

      <div className="relative mt-10 flex flex-1 animate-in fade-in slide-in-from-bottom-2 flex-col items-center justify-center overflow-hidden px-4 text-center">
        <Button className="py-4 text-pretty font-bold">TELEMETRYX</Button>
        <Label className="mt-5 text-4xl font-semibold text-primary">
          Twoje auto w liczbach.
        </Label>
        <Label className="text-4xl font-semibold">
          Telemetria, której możesz zaufać.
        </Label>
        <Label className="mt-5 text-base text-pretty">
          Precyzyjna analiza korekt paliwowych, obciążeń <br /> i wypadania
          zapłonów na przejrzystych wykresach.
        </Label>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          <Link href="/register">
            <Button className="p-5 text-xl font-semibold">Załóż konto</Button>
          </Link>
          <Link href="/login">
            <Button className="p-5 text-xl font-semibold" variant="outline">
              Zaloguj się
            </Button>
          </Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
