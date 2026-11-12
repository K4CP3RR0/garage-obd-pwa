import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SessionAlertsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Alerty sesji</h1>
      <p className="mt-2 text-muted-foreground">
        Alerty wykryte dla sesji {id}.
      </p>
      <Link
        href={`/sessions/${id}`}
        className="mt-4 inline-block text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Wróć do trasy
      </Link>
    </div>
  );
}
