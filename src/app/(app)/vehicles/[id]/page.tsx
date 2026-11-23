import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  fuelTypes,
  vehicleBrands,
  vehicleModels,
  vehicles,
} from "@/db/schema";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ id: string }>;
};

export const instant = false;

export default async function VehicleDetailPage({ params }: Props) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  const rows = await db
    .select({
      id: vehicles.id,
      productionYear: vehicles.productionYear,
      generation: vehicles.generation,
      vin: vehicles.vin,
      engineCode: vehicles.engineCode,
      engineDisplacementCm3: vehicles.engineDisplacementCm3,
      baseOdometerKm: vehicles.baseOdometerKm,
      image: vehicles.image,
      brandName: vehicleBrands.name,
      modelName: vehicleModels.name,
      fuelNamePl: fuelTypes.namePl,
    })
    .from(vehicles)
    .innerJoin(vehicleModels, eq(vehicles.modelId, vehicleModels.id))
    .innerJoin(vehicleBrands, eq(vehicleModels.brandId, vehicleBrands.id))
    .innerJoin(fuelTypes, eq(vehicles.fuelTypeId, fuelTypes.id))
    .where(and(eq(vehicles.id, id), eq(vehicles.userId, session.user.id)))
    .limit(1);

  const vehicle = rows[0];
  if (!vehicle) {
    notFound();
  }

  const title = `${vehicle.brandName} ${vehicle.modelName}`;
  const imageSrc =
    vehicle.image?.trim() || "/images/vehicle-placeholder.svg";
  const engineLabel = [vehicle.engineCode, vehicle.engineDisplacementCm3
    ? `${vehicle.engineDisplacementCm3} cm³`
    : null]
    .filter(Boolean)
    .join(" · ");

  const tiles = [
    { label: "Rok", value: String(vehicle.productionYear) },
    { label: "Paliwo", value: vehicle.fuelNamePl },
    {
      label: "Przebieg",
      value: `${vehicle.baseOdometerKm.toLocaleString("pl-PL")} km`,
    },
    {
      label: "Silnik",
      value: engineLabel || "—",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/garage"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Garaż
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {title}
          {vehicle.generation ? (
            <span className="text-muted-foreground"> · {vehicle.generation}</span>
          ) : null}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {vehicle.vin ? `VIN: ${vehicle.vin}` : "Brak numeru VIN"}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="aspect-[2/1] w-full bg-muted sm:aspect-[2.5/1]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={title}
            className="size-full object-cover object-[center_90%]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-xl border bg-card p-4 text-card-foreground shadow-xs"
          >
            <p className="text-xs font-medium text-muted-foreground">{tile.label}</p>
            <p className="mt-1 text-sm font-semibold sm:text-base">{tile.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/import"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Import CSV
        </Link>
        <Link
          href={`/vehicles/${vehicle.id}/sessions`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Trasy pojazdu
        </Link>
      </div>

      <section className="rounded-xl border bg-card p-4 text-card-foreground shadow-xs">
        <h2 className="text-sm font-semibold">Ostatnie trasy</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Brak sesji diagnostycznych — pojawią się po imporcie CSV.
        </p>
      </section>
    </div>
  );
}
