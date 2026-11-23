import Link from "next/link";
import { headers } from "next/headers";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  fuelTypes,
  vehicleBrands,
  vehicleModels,
  vehicles,
} from "@/db/schema";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

// getSession + DB → brak instant navigation (jak w (app)/layout)
export const instant = false;

export default async function GaragePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const rows = await db
    .select({
      id: vehicles.id,
      productionYear: vehicles.productionYear,
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
    .where(eq(vehicles.userId, session.user.id))
    .orderBy(asc(vehicleBrands.name), asc(vehicleModels.name));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Garaż</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Twoje pojazdy w Telemetryx — kliknij kartę, aby otworzyć szczegóły.
          </p>
        </div>
        <Link
          href="/vehicles/new"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Dodaj pojazd
        </Link>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Brak pojazdów</CardTitle>
            <CardDescription>
              Dodaj pierwsze auto, żeby zacząć import logów Car Scanner.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/vehicles/new">
              <Button type="button">Dodaj pojazd</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
