-- Dopinka kolumny image do istniejącej bazy Telemetryx
--   psql -U telemetryx -d garageobd_dev -f db/patch_vehicles_image.sql

ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS image text;
