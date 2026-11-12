import Link from "next/link";

export default function SessionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Trasy</h1>
      <p className="mt-2 text-muted-foreground">
        Lista sesji diagnostycznych pojawi się po imporcie CSV.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        Podgląd szczegółów (placeholder):{" "}
        <Link href="/sessions/demo" className="text-primary underline-offset-4 hover:underline">
          /sessions/demo
        </Link>
      </p>
    </div>
  );
}
