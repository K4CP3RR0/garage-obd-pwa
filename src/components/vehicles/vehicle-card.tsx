import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type VehicleCardData = {
  id: string;
  brandName: string;
  modelName: string;
  productionYear: number;
  fuelNamePl: string;
  baseOdometerKm: number;
  image: string | null;
};

const PLACEHOLDER = "/images/vehicle-placeholder.svg";

type Props = {
  vehicle: VehicleCardData;
};

export function VehicleCard({ vehicle }: Props) {
  const title = `${vehicle.brandName} ${vehicle.modelName}`;
  const href = `/vehicles/${vehicle.id}`;
  const src = vehicle.image?.trim() || PLACEHOLDER;

  return (
    <Link
      href={href}
      className="block h-full rounded-[min(var(--radius-4xl),24px)] outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full transition-colors hover:bg-muted/40">
        <div className="aspect-video w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={title}
            className="size-full object-cover object-[center_90%]"
          />
        </div>
        <CardHeader className="gap-1">
          <CardTitle>
            {title}
            <span className="text-muted-foreground"> · {vehicle.productionYear}</span>
          </CardTitle>
          <CardDescription>
            {vehicle.fuelNamePl} ·{" "}
            {vehicle.baseOdometerKm.toLocaleString("pl-PL")} km
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "pointer-events-none",
            )}
          >
            Otwórz
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
