import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function saveVehicleImage(
  file: File | null | undefined,
): Promise<{ path?: string; error?: string }> {
  if (!file || file.size === 0) {
    return {};
  }

  if (!ALLOWED.has(file.type)) {
    return { error: "Dozwolone formaty: JPG, PNG, WEBP" };
  }

  if (file.size > MAX_BYTES) {
    return { error: "Zdjęcie max 10 MB" };
  }

  const ext = EXT[file.type] ?? "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "vehicles");

  await mkdir(dir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), bytes);

  return { path: `/uploads/vehicles/${filename}` };
}
