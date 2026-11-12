import Link from "next/link";

export default function GaragePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Garaż</h1>
      <p className="mt-2 text-muted-foreground">Tu będą Twoje pojazdy.</p>
      <Link
        href="/vehicles/new"
        className="mt-4 inline-block text-sm text-primary underline-offset-4 hover:underline"
      >
        Dodaj pojazd
      </Link>
    </div>
  );
}