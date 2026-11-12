import Link from "next/link";

export default function NewVehiclePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dodaj pojazd</h1>
      <p className="mt-2 text-muted-foreground">
        Formularz ewidencji (marka, model, paliwo, VIN…) — później z Drizzle.
      </p>
      <Link
        href="/garage"
        className="mt-4 inline-block text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Wróć do garażu
      </Link>
    </div>
  );
}
