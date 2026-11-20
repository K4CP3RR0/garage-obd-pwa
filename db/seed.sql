-- ==========================================
-- Telemetryx — seed słowników (idempotentny)
-- Pasuje do db/schema.sql
--   psql -U telemetryx -d garageobd_dev -f db/seed.sql
-- ==========================================

BEGIN;

-- ------------------------------------------
-- 1. fuel_types
-- ------------------------------------------
INSERT INTO fuel_types (code, name_pl) VALUES
  ('petrol',   'Benzyna'),
  ('diesel',   'Diesel'),
  ('lpg',      'LPG'),
  ('hybrid',   'Hybryda'),
  ('electric', 'Elektryczny')
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------
-- 2. vehicle_brands (kompaktowy katalog pod demo PL / OBD)
-- ------------------------------------------
INSERT INTO vehicle_brands (name) VALUES
  ('Honda'),
  ('Toyota'),
  ('Volkswagen'),
  ('BMW'),
  ('Ford'),
  ('Audi'),
  ('Skoda'),
  ('Opel'),
  ('Mazda'),
  ('Hyundai'),
  ('Kia'),
  ('Mercedes-Benz'),
  ('Renault'),
  ('Peugeot'),
  ('Volvo')
ON CONFLICT (name) DO NOTHING;

-- ------------------------------------------
-- 3. vehicle_models (po kilka na markę — bez „całego świata”)
-- ------------------------------------------
INSERT INTO vehicle_models (brand_id, name)
SELECT b.id, m.name
FROM vehicle_brands b
JOIN (
  VALUES
    ('Honda', 'Civic'),
    ('Honda', 'Accord'),
    ('Honda', 'CR-V'),
    ('Toyota', 'Corolla'),
    ('Toyota', 'Yaris'),
    ('Toyota', 'RAV4'),
    ('Volkswagen', 'Golf'),
    ('Volkswagen', 'Passat'),
    ('Volkswagen', 'Polo'),
    ('BMW', '3 Series'),
    ('BMW', '5 Series'),
    ('BMW', 'X3'),
    ('Ford', 'Focus'),
    ('Ford', 'Fiesta'),
    ('Ford', 'Mondeo'),
    ('Audi', 'A3'),
    ('Audi', 'A4'),
    ('Audi', 'Q5'),
    ('Skoda', 'Octavia'),
    ('Skoda', 'Fabia'),
    ('Skoda', 'Superb'),
    ('Opel', 'Astra'),
    ('Opel', 'Corsa'),
    ('Mazda', '3'),
    ('Mazda', '6'),
    ('Mazda', 'CX-5'),
    ('Hyundai', 'i30'),
    ('Hyundai', 'Tucson'),
    ('Kia', 'Ceed'),
    ('Kia', 'Sportage'),
    ('Mercedes-Benz', 'C-Class'),
    ('Mercedes-Benz', 'E-Class'),
    ('Renault', 'Clio'),
    ('Renault', 'Megane'),
    ('Peugeot', '208'),
    ('Peugeot', '308'),
    ('Volvo', 'V60'),
    ('Volvo', 'XC60')
) AS m(brand_name, name) ON m.brand_name = b.name
ON CONFLICT (brand_id, name) DO NOTHING;

-- ------------------------------------------
-- 4. anomaly_categories (sedno Telemetryx)
-- ------------------------------------------
INSERT INTO anomaly_categories (code, name_pl, default_severity) VALUES
  ('MISFIRE',          'Wypadanie zapłonów',                    'WARNING'),
  ('FUEL_TRIM_LEAN',   'Uboga mieszanka (STFT/LTFT)',            'WARNING'),
  ('FUEL_TRIM_RICH',   'Bogata mieszanka (STFT/LTFT)',           'WARNING'),
  ('THERMAL_STALL',    'Nieprawidłowa dynamika termiczna',       'CRITICAL'),
  ('THERMAL_OVERHEAT', 'Przegrzanie cieczy chłodzącej',          'CRITICAL'),
  ('SENSOR_PLAUS',     'Niespójność wskazań czujników',          'INFO'),
  ('VOLTAGE_LOW',      'Niskie napięcie instalacji',             'WARNING')
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------
-- 5. dtc_codes — częste OBD-II (PL/EN), format P0xxx itd.
-- ------------------------------------------
INSERT INTO dtc_codes (code, description_pl, description_en, system) VALUES
  ('P0300', 'Losowe / wielocylindrowe wypadanie zapłonów', 'Random/multiple cylinder misfire detected', 'ignition'),
  ('P0301', 'Wypadanie zapłonów — cylinder 1', 'Cylinder 1 misfire detected', 'ignition'),
  ('P0302', 'Wypadanie zapłonów — cylinder 2', 'Cylinder 2 misfire detected', 'ignition'),
  ('P0303', 'Wypadanie zapłonów — cylinder 3', 'Cylinder 3 misfire detected', 'ignition'),
  ('P0304', 'Wypadanie zapłonów — cylinder 4', 'Cylinder 4 misfire detected', 'ignition'),
  ('P0171', 'Układ paliwowy zbyt ubogi (Bank 1)', 'System too lean (Bank 1)', 'fuel'),
  ('P0172', 'Układ paliwowy zbyt bogaty (Bank 1)', 'System too rich (Bank 1)', 'fuel'),
  ('P0174', 'Układ paliwowy zbyt ubogi (Bank 2)', 'System too lean (Bank 2)', 'fuel'),
  ('P0175', 'Układ paliwowy zbyt bogaty (Bank 2)', 'System too rich (Bank 2)', 'fuel'),
  ('P0420', 'Niska wydajność katalizatora (Bank 1)', 'Catalyst system efficiency below threshold (Bank 1)', 'emissions'),
  ('P0430', 'Niska wydajność katalizatora (Bank 2)', 'Catalyst system efficiency below threshold (Bank 2)', 'emissions'),
  ('P0128', 'Termostat — temperatura poniżej zakresu regulacji', 'Coolant thermostat (coolant temperature below thermostat regulating temperature)', 'thermal'),
  ('P0113', 'Czujnik IAT — sygnał za wysoki', 'Intake air temperature sensor 1 circuit high', 'thermal'),
  ('P0118', 'Czujnik ECT — sygnał za wysoki', 'Engine coolant temperature sensor 1 circuit high', 'thermal'),
  ('P0101', 'MAF — zakres / wydajność', 'Mass or volume air flow sensor A circuit range/performance', 'fuel'),
  ('P0106', 'MAP — zakres / wydajność', 'Manifold absolute pressure/barometric pressure sensor range/performance', 'fuel'),
  ('P0500', 'Czujnik prędkości pojazdu', 'Vehicle speed sensor A', 'network'),
  ('P0562', 'Niskie napięcie systemu', 'System voltage low', 'network'),
  ('P0442', 'Układ EVAP — mały przeciek', 'Evaporative emission system leak detected (small leak)', 'emissions'),
  ('P0401', 'EGR — niewystarczający przepływ', 'Exhaust gas recirculation A flow insufficient detected', 'emissions'),
  ('P0130', 'Sonda lambda (Bank 1 Sensor 1) — usterka obwodu', 'O2 sensor circuit (Bank 1 Sensor 1)', 'emissions'),
  ('P0133', 'Sonda lambda (Bank 1 Sensor 1) — wolna odpowiedź', 'O2 sensor circuit slow response (Bank 1 Sensor 1)', 'emissions'),
  ('P0335', 'Czujnik położenia wału — usterka obwodu', 'Crankshaft position sensor A circuit', 'ignition'),
  ('P0340', 'Czujnik położenia wałka rozrządu — usterka obwodu', 'Camshaft position sensor A circuit (Bank 1 or single sensor)', 'ignition'),
  ('P0700', 'Usterka skrzyni biegów (żądanie MIL)', 'Transmission control system (MIL request)', 'network')
ON CONFLICT (code) DO NOTHING;

COMMIT;
