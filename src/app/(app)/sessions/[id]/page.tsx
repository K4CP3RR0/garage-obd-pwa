import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SessionDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Trasa</h1>
      <p className="mt-2 text-muted-foreground">ID sesji: {id}</p>
      <p className="mt-2 text-muted-foreground">
        Tu będą wykresy telemetrii i agregaty z importu.
      </p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <Link
          href={`/sessions/${id}/dtc`}
          className="text-primary underline-offset-4 hover:underline"
        >
          DTC
        </Link>
        <Link
          href={`/sessions/${id}/alerts`}
          className="text-primary underline-offset-4 hover:underline"
        >
          Alerty sesji
        </Link>
        <Link
          href="/sessions"
          className="text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Lista tras
        </Link>
      </div>
    </div>
  );
}
