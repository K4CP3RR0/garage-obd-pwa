import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function VehicleSessionsPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Trasy pojazdu</h1>
      <p className="mt-2 text-muted-foreground">
        Sesje diagnostyczne dla pojazdu {id}.
      </p>
      <Link
        href={`/vehicles/${id}`}
        className="mt-4 inline-block text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Wróć do pojazdu
      </Link>
    </div>
  );
}
