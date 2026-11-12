-- ==========================================
-- Telemetryx (repo: garage-obd-pwa)
-- PostgreSQL schema 
-- Struktura: tabele → FK/UNIQUE/indeksy → CHECK na dole
-- ==========================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------
-- 1. AUTH (Better-Auth)
-- ------------------------------------------

CREATE TABLE users (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            varchar(100) NOT NULL,
  email           varchar(255) NOT NULL,
  email_verified  boolean DEFAULT false,
  image           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_email_uq UNIQUE (email)
);

CREATE TABLE user_accounts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  account_id      text NOT NULL,
  provider_id     text NOT NULL,
  password_hash   text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_accounts_provider_account_uq UNIQUE (provider_id, account_id)
);

CREATE INDEX user_accounts_user_id_idx ON user_accounts (user_id);

CREATE TABLE user_sessions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token           text NOT NULL,
  expires_at      timestamptz NOT NULL,
  ip_address      varchar(45),
  user_agent      text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_sessions_token_uq UNIQUE (token)
);

CREATE INDEX user_sessions_user_id_idx ON user_sessions (user_id);

-- ------------------------------------------
-- 2. SŁOWNIKI / LOOKUPY
-- ------------------------------------------

CREATE TABLE fuel_types (
  id       smallserial PRIMARY KEY,
  code     varchar(20) NOT NULL,
  name_pl  varchar(40) NOT NULL,
  CONSTRAINT fuel_types_code_uq UNIQUE (code)
);

CREATE TABLE vehicle_brands (
  id    smallserial PRIMARY KEY,
  name  varchar(60) NOT NULL,
  CONSTRAINT vehicle_brands_name_uq UNIQUE (name)
);

CREATE TABLE vehicle_models (
  id        serial PRIMARY KEY,
  brand_id  smallint NOT NULL REFERENCES vehicle_brands (id),
  name      varchar(60) NOT NULL,
  CONSTRAINT vehicle_models_brand_name_uq UNIQUE (brand_id, name)
);

CREATE TABLE dtc_codes (
  code             varchar(10) PRIMARY KEY,
  description_pl   text NOT NULL,
  description_en   text,
  system           varchar(40)
);

CREATE TABLE anomaly_categories (
  id                 smallserial PRIMARY KEY,
  code               varchar(50) NOT NULL,
  name_pl            varchar(100) NOT NULL,
  default_severity   varchar(20),
  CONSTRAINT anomaly_categories_code_uq UNIQUE (code)
);

-- ------------------------------------------
-- 3. POJAZDY
-- ------------------------------------------

CREATE TABLE vehicles (
  id                         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                    uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  model_id                   int NOT NULL REFERENCES vehicle_models (id),
  generation                 varchar(30),
  production_year            int NOT NULL,
  vin                        varchar(17),
  fuel_type_id               smallint NOT NULL REFERENCES fuel_types (id),
  engine_code                varchar(30),
  engine_displacement_cm3    int,
  base_odometer_km           int NOT NULL DEFAULT 0,
  created_at                 timestamptz NOT NULL DEFAULT now(),
  updated_at                 timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT vehicles_vin_uq UNIQUE (vin)
);

CREATE INDEX vehicles_user_id_idx ON vehicles (user_id);

-- ------------------------------------------
-- 4. SESJE DIAGNOSTYCZNE
-- ------------------------------------------

CREATE TABLE diagnostic_sessions (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id               uuid NOT NULL REFERENCES vehicles (id) ON DELETE CASCADE,
  filename                 varchar(255) NOT NULL,
  session_start            timestamptz NOT NULL,
  session_end              timestamptz NOT NULL,
  duration_seconds         int NOT NULL,
  distance_km              decimal(8, 2) DEFAULT 0.00,
  avg_speed_kmh            decimal(5, 2),
  max_speed_kmh            decimal(5, 2),
  max_rpm                  int,
  max_coolant_temp_c       int,
  avg_stft_pct             decimal(5, 2),
  avg_ltft_pct             decimal(5, 2),
  misfire_total_detected   int DEFAULT 0,
  has_dtc                  boolean DEFAULT false,
  created_at               timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT diagnostic_sessions_vehicle_filename_uq UNIQUE (vehicle_id, filename)
);

CREATE INDEX diagnostic_sessions_vehicle_start_idx
  ON diagnostic_sessions (vehicle_id, session_start);

-- ------------------------------------------
-- 5. TELEMETRIA
-- ------------------------------------------

CREATE TABLE telemetry_records (
  id                            bigserial PRIMARY KEY,
  session_id                    uuid NOT NULL REFERENCES diagnostic_sessions (id) ON DELETE CASCADE,
  timestamp_offset_ms           int NOT NULL,
  recorded_at                   timestamptz,
  vehicle_speed_kmh             decimal(5, 2),
  engine_rpm                    int,
  engine_load_pct               decimal(5, 2),
  throttle_pos_pct              decimal(5, 2),
  short_term_fuel_trim          decimal(5, 2),
  long_term_fuel_trim           decimal(5, 2),
  intake_manifold_pressure_kpa  decimal(6, 2),
  mass_air_flow_gs              decimal(6, 2),
  coolant_temp_c                int,
  intake_air_temp_c             int,
  control_module_voltage        decimal(4, 2),
  misfire_cyl1                  int DEFAULT 0,
  misfire_cyl2                  int DEFAULT 0,
  misfire_cyl3                  int DEFAULT 0,
  misfire_cyl4                  int DEFAULT 0,
  CONSTRAINT telemetry_session_offset_uq UNIQUE (session_id, timestamp_offset_ms)
);

-- ------------------------------------------
-- 6. DTC + FREEZE FRAME (1:1)
-- ------------------------------------------

CREATE TABLE dtc_records (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    uuid NOT NULL REFERENCES diagnostic_sessions (id) ON DELETE CASCADE,
  dtc_code      varchar(10) NOT NULL REFERENCES dtc_codes (code),
  status        varchar(20) DEFAULT 'confirmed',
  detected_at   timestamptz NOT NULL,
  CONSTRAINT dtc_records_session_code_time_uq UNIQUE (session_id, dtc_code, detected_at)
);

CREATE INDEX dtc_records_session_id_idx ON dtc_records (session_id);

CREATE TABLE dtc_freeze_frames (
  dtc_record_id            uuid PRIMARY KEY REFERENCES dtc_records (id) ON DELETE CASCADE,
  freeze_rpm               int,
  freeze_speed_kmh         decimal(5, 2),
  freeze_coolant_temp_c    int,
  freeze_engine_load_pct   decimal(5, 2)
);

-- ------------------------------------------
-- 7. ALERTY ANOMALII
-- ------------------------------------------

CREATE TABLE anomaly_alerts (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        uuid NOT NULL REFERENCES diagnostic_sessions (id) ON DELETE CASCADE,
  category_id       smallint NOT NULL REFERENCES anomaly_categories (id),
  severity          varchar(20) NOT NULL,
  title             varchar(150) NOT NULL,
  description       text NOT NULL,
  metric_name       varchar(50),
  metric_value      decimal(8, 2),
  threshold_value   decimal(8, 2),
  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX anomaly_alerts_session_id_idx ON anomaly_alerts (session_id);
CREATE INDEX anomaly_alerts_category_id_idx ON anomaly_alerts (category_id);

-- ==========================================
-- CHECK CONSTRAINTS (na dole — osobna warstwa)
-- ==========================================

-- dtc_codes
ALTER TABLE dtc_codes
  ADD CONSTRAINT dtc_codes_code_format_chk
  CHECK (code ~ '^[PCBU][0-9A-F]{4}$');

-- anomaly_categories
ALTER TABLE anomaly_categories
  ADD CONSTRAINT anomaly_categories_severity_chk
  CHECK (default_severity IS NULL OR default_severity IN ('INFO', 'WARNING', 'CRITICAL'));

-- vehicles
ALTER TABLE vehicles
  ADD CONSTRAINT vehicles_production_year_chk
  CHECK (production_year BETWEEN 1950 AND 2100);

ALTER TABLE vehicles
  ADD CONSTRAINT vehicles_vin_length_chk
  CHECK (vin IS NULL OR char_length(vin) = 17);

ALTER TABLE vehicles
  ADD CONSTRAINT vehicles_displacement_chk
  CHECK (engine_displacement_cm3 IS NULL OR engine_displacement_cm3 > 0);

ALTER TABLE vehicles
  ADD CONSTRAINT vehicles_odometer_chk
  CHECK (base_odometer_km >= 0);

-- diagnostic_sessions
ALTER TABLE diagnostic_sessions
  ADD CONSTRAINT diagnostic_sessions_time_chk
  CHECK (session_end >= session_start);

ALTER TABLE diagnostic_sessions
  ADD CONSTRAINT diagnostic_sessions_duration_chk
  CHECK (duration_seconds >= 0);

ALTER TABLE diagnostic_sessions
  ADD CONSTRAINT diagnostic_sessions_distance_chk
  CHECK (distance_km >= 0);

ALTER TABLE diagnostic_sessions
  ADD CONSTRAINT diagnostic_sessions_misfire_chk
  CHECK (misfire_total_detected >= 0);

ALTER TABLE diagnostic_sessions
  ADD CONSTRAINT diagnostic_sessions_rpm_chk
  CHECK (max_rpm IS NULL OR max_rpm >= 0);

ALTER TABLE diagnostic_sessions
  ADD CONSTRAINT diagnostic_sessions_avg_speed_chk
  CHECK (avg_speed_kmh IS NULL OR avg_speed_kmh >= 0);

ALTER TABLE diagnostic_sessions
  ADD CONSTRAINT diagnostic_sessions_max_speed_chk
  CHECK (max_speed_kmh IS NULL OR max_speed_kmh >= 0);

-- telemetry_records
ALTER TABLE telemetry_records
  ADD CONSTRAINT telemetry_offset_chk
  CHECK (timestamp_offset_ms >= 0);

ALTER TABLE telemetry_records
  ADD CONSTRAINT telemetry_speed_chk
  CHECK (vehicle_speed_kmh IS NULL OR vehicle_speed_kmh >= 0);

ALTER TABLE telemetry_records
  ADD CONSTRAINT telemetry_rpm_chk
  CHECK (engine_rpm IS NULL OR engine_rpm >= 0);

ALTER TABLE telemetry_records
  ADD CONSTRAINT telemetry_load_chk
  CHECK (engine_load_pct IS NULL OR engine_load_pct BETWEEN 0 AND 100);

ALTER TABLE telemetry_records
  ADD CONSTRAINT telemetry_throttle_chk
  CHECK (throttle_pos_pct IS NULL OR throttle_pos_pct BETWEEN 0 AND 100);

ALTER TABLE telemetry_records
  ADD CONSTRAINT telemetry_misfire_chk
  CHECK (
    COALESCE(misfire_cyl1, 0) >= 0
    AND COALESCE(misfire_cyl2, 0) >= 0
    AND COALESCE(misfire_cyl3, 0) >= 0
    AND COALESCE(misfire_cyl4, 0) >= 0
  );

-- dtc_records
ALTER TABLE dtc_records
  ADD CONSTRAINT dtc_records_status_chk
  CHECK (status IN ('pending', 'confirmed', 'permanent'));

-- dtc_freeze_frames
ALTER TABLE dtc_freeze_frames
  ADD CONSTRAINT freeze_rpm_chk
  CHECK (freeze_rpm IS NULL OR freeze_rpm >= 0);

ALTER TABLE dtc_freeze_frames
  ADD CONSTRAINT freeze_speed_chk
  CHECK (freeze_speed_kmh IS NULL OR freeze_speed_kmh >= 0);

ALTER TABLE dtc_freeze_frames
  ADD CONSTRAINT freeze_load_chk
  CHECK (
    freeze_engine_load_pct IS NULL
    OR freeze_engine_load_pct BETWEEN 0 AND 100
  );

-- anomaly_alerts
ALTER TABLE anomaly_alerts
  ADD CONSTRAINT anomaly_alerts_severity_chk
  CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL'));
