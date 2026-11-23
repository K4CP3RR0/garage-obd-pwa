import { connection } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { fuelTypes, vehicleBrands, vehicleModels } from "@/db/schema";
import { NewVehicleForm } from "@/components/vehicles/new-vehicle-form";

export const instant = false;

export default async function NewVehiclePage() {
  // Bez tego Next próbuje prerender + DB w Docker build (ECONNREFUSED 127.0.0.1)
  await connection();

  const [brands, models, fuels] = await Promise.all([
    db
      .select({ id: vehicleBrands.id, name: vehicleBrands.name })
      .from(vehicleBrands)
      .orderBy(asc(vehicleBrands.name)),
    db
      .select({
        id: vehicleModels.id,
        brandId: vehicleModels.brandId,
        name: vehicleModels.name,
      })
      .from(vehicleModels)
      .orderBy(asc(vehicleModels.name)),
    db
      .select({ id: fuelTypes.id, namePl: fuelTypes.namePl })
      .from(fuelTypes)
      .orderBy(asc(fuelTypes.id)),
  ]);

  return (
    <div className="space-y-4">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Nowy pojazd</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Wymagane: marka, model, rok, paliwo i przebieg. Reszta opcjonalna.
        </p>
      </div>
      <NewVehicleForm brands={brands} models={models} fuels={fuels} />
    </div>
  );
}
