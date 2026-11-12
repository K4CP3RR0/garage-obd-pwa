import {
  boolean,
  bigserial,
  integer,
  numeric,
  pgTable,
  serial,
  smallint,
  smallserial,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ------------------------------------------
// 1. AUTH (Better-Auth)
// Klucze obiektów = modelName w Better-Auth
// ------------------------------------------

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const user_accounts = pgTable(
  "user_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    // Better-Auth field: password → kolumna password_hash
    password: text("password_hash"),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
    }),
    scope: text("scope"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("user_accounts_provider_account_uq").on(t.providerId, t.accountId)],
);

export const user_sessions = pgTable("user_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const verifications = pgTable("verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ------------------------------------------
// 2. SŁOWNIKI
// ------------------------------------------

export const fuelTypes = pgTable("fuel_types", {
  id: smallserial("id").primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  namePl: varchar("name_pl", { length: 40 }).notNull(),
});

export const vehicleBrands = pgTable("vehicle_brands", {
  id: smallserial("id").primaryKey(),
  name: varchar("name", { length: 60 }).notNull().unique(),
});

export const vehicleModels = pgTable(
  "vehicle_models",
  {
    id: serial("id").primaryKey(),
    brandId: smallint("brand_id")
      .notNull()
      .references(() => vehicleBrands.id),
    name: varchar("name", { length: 60 }).notNull(),
  },
  (t) => [unique("vehicle_models_brand_name_uq").on(t.brandId, t.name)],
);

export const dtcCodes = pgTable("dtc_codes", {
  code: varchar("code", { length: 10 }).primaryKey(),
  descriptionPl: text("description_pl").notNull(),
  descriptionEn: text("description_en"),
  system: varchar("system", { length: 40 }),
});

export const anomalyCategories = pgTable("anomaly_categories", {
  id: smallserial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  namePl: varchar("name_pl", { length: 100 }).notNull(),
  defaultSeverity: varchar("default_severity", { length: 20 }),
});

// ------------------------------------------
// 3. POJAZDY
// ------------------------------------------

export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  modelId: integer("model_id")
    .notNull()
    .references(() => vehicleModels.id),
  generation: varchar("generation", { length: 30 }),
  productionYear: integer("production_year").notNull(),
  vin: varchar("vin", { length: 17 }).unique(),
  fuelTypeId: smallint("fuel_type_id")
    .notNull()
    .references(() => fuelTypes.id),
  engineCode: varchar("engine_code", { length: 30 }),
  engineDisplacementCm3: integer("engine_displacement_cm3"),
  baseOdometerKm: integer("base_odometer_km").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ------------------------------------------
// 4. SESJE DIAGNOSTYCZNE
// ------------------------------------------

export const diagnosticSessions = pgTable(
  "diagnostic_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vehicleId: uuid("vehicle_id")
      .notNull()
      .references(() => vehicles.id, { onDelete: "cascade" }),
    filename: varchar("filename", { length: 255 }).notNull(),
    sessionStart: timestamp("session_start", { withTimezone: true }).notNull(),
    sessionEnd: timestamp("session_end", { withTimezone: true }).notNull(),
    durationSeconds: integer("duration_seconds").notNull(),
    distanceKm: numeric("distance_km", { precision: 8, scale: 2 }).default("0.00"),
    avgSpeedKmh: numeric("avg_speed_kmh", { precision: 5, scale: 2 }),
    maxSpeedKmh: numeric("max_speed_kmh", { precision: 5, scale: 2 }),
    maxRpm: integer("max_rpm"),
    maxCoolantTempC: integer("max_coolant_temp_c"),
    avgStftPct: numeric("avg_stft_pct", { precision: 5, scale: 2 }),
    avgLtftPct: numeric("avg_ltft_pct", { precision: 5, scale: 2 }),
    misfireTotalDetected: integer("misfire_total_detected").default(0),
    hasDtc: boolean("has_dtc").default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique("diagnostic_sessions_vehicle_filename_uq").on(t.vehicleId, t.filename),
  ],
);

// ------------------------------------------
// 5. TELEMETRIA
// ------------------------------------------

export const telemetryRecords = pgTable(
  "telemetry_records",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => diagnosticSessions.id, { onDelete: "cascade" }),
    timestampOffsetMs: integer("timestamp_offset_ms").notNull(),
    recordedAt: timestamp("recorded_at", { withTimezone: true }),
    vehicleSpeedKmh: numeric("vehicle_speed_kmh", { precision: 5, scale: 2 }),
    engineRpm: integer("engine_rpm"),
    engineLoadPct: numeric("engine_load_pct", { precision: 5, scale: 2 }),
    throttlePosPct: numeric("throttle_pos_pct", { precision: 5, scale: 2 }),
    shortTermFuelTrim: numeric("short_term_fuel_trim", { precision: 5, scale: 2 }),
    longTermFuelTrim: numeric("long_term_fuel_trim", { precision: 5, scale: 2 }),
    intakeManifoldPressureKpa: numeric("intake_manifold_pressure_kpa", {
      precision: 6,
      scale: 2,
    }),
    massAirFlowGs: numeric("mass_air_flow_gs", { precision: 6, scale: 2 }),
    coolantTempC: integer("coolant_temp_c"),
    intakeAirTempC: integer("intake_air_temp_c"),
    controlModuleVoltage: numeric("control_module_voltage", {
      precision: 4,
      scale: 2,
    }),
    misfireCyl1: integer("misfire_cyl1").default(0),
    misfireCyl2: integer("misfire_cyl2").default(0),
    misfireCyl3: integer("misfire_cyl3").default(0),
    misfireCyl4: integer("misfire_cyl4").default(0),
  },
  (t) => [
    unique("telemetry_session_offset_uq").on(t.sessionId, t.timestampOffsetMs),
  ],
);

// ------------------------------------------
// 6. DTC + FREEZE FRAME
// ------------------------------------------

export const dtcRecords = pgTable(
  "dtc_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => diagnosticSessions.id, { onDelete: "cascade" }),
    dtcCode: varchar("dtc_code", { length: 10 })
      .notNull()
      .references(() => dtcCodes.code),
    status: varchar("status", { length: 20 }).default("confirmed"),
    detectedAt: timestamp("detected_at", { withTimezone: true }).notNull(),
  },
  (t) => [
    unique("dtc_records_session_code_time_uq").on(
      t.sessionId,
      t.dtcCode,
      t.detectedAt,
    ),
  ],
);

export const dtcFreezeFrames = pgTable("dtc_freeze_frames", {
  dtcRecordId: uuid("dtc_record_id")
    .primaryKey()
    .references(() => dtcRecords.id, { onDelete: "cascade" }),
  freezeRpm: integer("freeze_rpm"),
  freezeSpeedKmh: numeric("freeze_speed_kmh", { precision: 5, scale: 2 }),
  freezeCoolantTempC: integer("freeze_coolant_temp_c"),
  freezeEngineLoadPct: numeric("freeze_engine_load_pct", {
    precision: 5,
    scale: 2,
  }),
});

// ------------------------------------------
// 7. ALERTY
// ------------------------------------------

export const anomalyAlerts = pgTable("anomaly_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => diagnosticSessions.id, { onDelete: "cascade" }),
  categoryId: smallint("category_id")
    .notNull()
    .references(() => anomalyCategories.id),
  severity: varchar("severity", { length: 20 }).notNull(),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description").notNull(),
  metricName: varchar("metric_name", { length: 50 }),
  metricValue: numeric("metric_value", { precision: 8, scale: 2 }),
  thresholdValue: numeric("threshold_value", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
