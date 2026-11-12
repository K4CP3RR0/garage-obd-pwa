import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function VehicleDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Pojazd</h1>
      <p className="mt-2 text-muted-foreground">ID: {id}</p>
      <p className="mt-2 text-muted-foreground">
        Dashboard pojazdu: przebieg, ostatnia sesja, status zdrowia.
      </p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <Link
          href={`/vehicles/${id}/sessions`}
          className="text-primary underline-offset-4 hover:underline"
        >
          Trasy pojazdu
        </Link>
        <Link
          href="/garage"
          className="text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Garaż
        </Link>
      </div>
    </div>
  );
}
