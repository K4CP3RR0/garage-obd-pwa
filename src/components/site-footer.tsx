import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          <Link href="/" className="font-medium text-foreground hover:underline">
            Telemetryx
          </Link>
          {" — "}diagnostyka predykcyjna OBD
        </p>
        <p>© 2026 Telemetryx</p>
      </div>
    </footer>
  );
}
