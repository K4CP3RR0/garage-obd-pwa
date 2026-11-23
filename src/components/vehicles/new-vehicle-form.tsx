"use client";

import Link from "next/link";
import { useActionState, useMemo, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createVehicle,
  type CreateVehicleState,
} from "@/app/(app)/vehicles/actions";

type Brand = { id: number; name: string };
type Model = { id: number; brandId: number; name: string };
type Fuel = { id: number; namePl: string };

type Props = {
  brands: Brand[];
  models: Model[];
  fuels: Fuel[];
};

const initialState: CreateVehicleState = {};
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export function NewVehicleForm({ brands, models, fuels }: Props) {
  const [state, formAction, pending] = useActionState(
    createVehicle,
    initialState,
  );
  const [brandId, setBrandId] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [imageError, setImageError] = useState<string | null>(null);

  const filteredModels = useMemo(() => {
    if (!brandId) return [];
    return models.filter((m) => String(m.brandId) === brandId);
  }, [brandId, models]);

  function onBrandChange(value: string) {
    setBrandId(value);
    setModelId("");
  }

  function onImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setImageError(null);
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setImageError("Dozwolone formaty: JPG, PNG, WEBP");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Zdjęcie jest za duże (max 10 MB)");
      e.target.value = "";
      return;
    }
    setImageError(null);
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Dodaj pojazd</CardTitle>
        <CardDescription>
          Ewidencja auta w cyfrowym garażu Telemetryx
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandId">Marka</Label>
            <select
              id="brandId"
              name="brandId"
              required
              value={brandId}
              onChange={(e) => onBrandChange(e.target.value)}
              className="flex h-8 w-full rounded-2xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <option value="" disabled>
                Wybierz markę
              </option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelId">Model</Label>
            <select
              id="modelId"
              name="modelId"
              required
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              disabled={!brandId}
              className="flex h-8 w-full rounded-2xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50"
            >
              <option value="" disabled>
                {brandId ? "Wybierz model" : "Najpierw marka"}
              </option>
              {filteredModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            {state.fieldErrors?.modelId ? (
              <p className="text-sm text-destructive">
                {state.fieldErrors.modelId[0]}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="productionYear">Rok produkcji</Label>
              <Input
                id="productionYear"
                name="productionYear"
                type="number"
                min={1950}
                max={2100}
                required
                placeholder="2026"
              />
              {state.fieldErrors?.productionYear ? (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.productionYear[0]}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelTypeId">Paliwo</Label>
              <select
                id="fuelTypeId"
                name="fuelTypeId"
                required
                defaultValue=""
                className="flex h-8 w-full rounded-2xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              >
                <option value="" disabled>
                  Wybierz paliwo
                </option>
                {fuels.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.namePl}
                  </option>
                ))}
              </select>
              {state.fieldErrors?.fuelTypeId ? (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.fuelTypeId[0]}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="baseOdometerKm">Przebieg bazowy (km)</Label>
            <Input
              id="baseOdometerKm"
              name="baseOdometerKm"
              type="number"
              min={0}
              defaultValue={0}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="generation">Generacja (opcjonalnie)</Label>
            <Input
              id="generation"
              name="generation"
              maxLength={30}
              placeholder="np. VII Type-R"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vin">VIN (opcjonalnie, 17 znaków)</Label>
            <Input
              id="vin"
              name="vin"
              maxLength={17}
              placeholder="17 znaków"
              className="uppercase"
            />
            {state.fieldErrors?.vin ? (
              <p className="text-sm text-destructive">
                {state.fieldErrors.vin[0]}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="engineCode">Kod silnika</Label>
              <Input
                id="engineCode"
                name="engineCode"
                maxLength={30}
                placeholder="K20A2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="engineDisplacementCm3">Pojemność (cm³)</Label>
              <Input
                id="engineDisplacementCm3"
                name="engineDisplacementCm3"
                type="number"
                min={1}
                placeholder="1998"
              />
              {state.fieldErrors?.engineDisplacementCm3 ? (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.engineDisplacementCm3[0]}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageFile">Zdjęcie auta</Label>
            <Input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onImageChange}
            />
            <p className="text-xs text-muted-foreground">
              Opcjonalnie · JPG/PNG/WEBP · max 10 MB · zapisze się samo
            </p>
            {imageError ? (
              <p className="text-sm text-destructive">{imageError}</p>
            ) : null}
          </div>

          {state.error ? (
            <p className="text-sm text-destructive">{state.error}</p>
          ) : null}

          <Button
            className="w-full"
            type="submit"
            disabled={pending || Boolean(imageError)}
          >
            {pending ? "Zapisywanie..." : "Dodaj pojazd"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <Link
          href="/garage"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Wróć do garażu
        </Link>
      </CardFooter>
    </Card>
  );
}
