"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { saveVehicleImage } from "@/lib/vehicle-image";

const createVehicleSchema = z.object({
  modelId: z.coerce.number().int().positive("Wybierz model"),
  fuelTypeId: z.coerce.number().int().positive("Wybierz paliwo"),
  productionYear: z.coerce
    .number()
    .int()
    .min(1950, "Rok od 1950")
    .max(2100, "Rok max 2100"),
  baseOdometerKm: z.coerce.number().int().min(0, "Przebieg ≥ 0").default(0),
  generation: z.string().max(30).optional(),
  vin: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim().toUpperCase() : undefined))
    .refine((v) => v === undefined || v.length === 17, {
      message: "VIN musi mieć 17 znaków",
    }),
  engineCode: z.string().max(30).optional(),
  engineDisplacementCm3: z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? Number(v) : undefined))
    .refine((v) => v === undefined || (Number.isInteger(v) && v > 0), {
      message: "Pojemność musi być dodatnią liczbą całkowitą",
    }),
});

export type CreateVehicleState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createVehicle(
  _prev: CreateVehicleState,
  formData: FormData,
): Promise<CreateVehicleState> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Brak sesji — zaloguj się ponownie" };
  }

  const parsed = createVehicleSchema.safeParse({
    modelId: formData.get("modelId"),
    fuelTypeId: formData.get("fuelTypeId"),
    productionYear: formData.get("productionYear"),
    baseOdometerKm: formData.get("baseOdometerKm") || "0",
    generation: formData.get("generation") || undefined,
    vin: formData.get("vin") || undefined,
    engineCode: formData.get("engineCode") || undefined,
    engineDisplacementCm3: formData.get("engineDisplacementCm3") || undefined,
  });

  if (!parsed.success) {
    return {
      error: "Sprawdź poprawność formularza",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  const rawImage = formData.get("imageFile");
  const imageFile = rawImage instanceof File ? rawImage : null;
  const uploaded = await saveVehicleImage(imageFile);
  if (uploaded.error) {
    return { error: uploaded.error };
  }

  let createdId: string;

  try {
    const [created] = await db
      .insert(vehicles)
      .values({
        userId: session.user.id,
        modelId: data.modelId,
        fuelTypeId: data.fuelTypeId,
        productionYear: data.productionYear,
        baseOdometerKm: data.baseOdometerKm,
        generation: data.generation?.trim() || null,
        vin: data.vin ?? null,
        engineCode: data.engineCode?.trim() || null,
        engineDisplacementCm3: data.engineDisplacementCm3 ?? null,
        image: uploaded.path ?? null,
      })
      .returning({ id: vehicles.id });

    createdId = created.id;
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("vehicles_vin_uq") || message.includes("unique")) {
      return { error: "Ten VIN jest już zajęty" };
    }
    return { error: "Nie udało się dodać pojazdu" };
  }

  redirect(`/vehicles/${createdId}`);
}
