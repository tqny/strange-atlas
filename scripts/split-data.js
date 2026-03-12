#!/usr/bin/env node
/**
 * split-data.js
 *
 * Reads strange_places_v5.2.json and splits into per-category JSON files.
 * Strips to core fields only (lat, lng, name, description, date) + select extras.
 * Outputs to ../data/
 */

const fs = require('fs');
const path = require('path');

const SOURCE = path.join(__dirname, '..', 'strange_places_v5.2.json');
const OUT_DIR = path.join(__dirname, '..', 'data');

// Map source category keys → clean filenames and display names
const CATEGORY_MAP = {
  'usgs_volcanoes':       { file: 'volcanoes',        display: 'Volcanoes',         extras: ['volcano_type', 'last_eruption', 'elevation_m'] },
  'noaa_shipwrecks':      { file: 'shipwrecks',       display: 'Shipwrecks',        extras: ['vessel_type', 'cargo'] },
  'bigfoot_sightings':    { file: 'bigfoot',          display: 'Bigfoot Sightings', extras: [] },
  'nasa_fireballs':       { file: 'fireballs',        display: 'Fireballs',         extras: ['velocity_km_s', 'energy_joules'] },
  'usgs_earthquakes':     { file: 'earthquakes',      display: 'Earthquakes',       extras: ['magnitude', 'depth_km'] },
  'noaa_thermal_springs': { file: 'thermal-springs',  display: 'Thermal Springs',   extras: ['temperature'] },
  'haunted_places':       { file: 'haunted-places',   display: 'Haunted Places',    extras: ['city', 'state'] },
  'nasa_meteorites':      { file: 'meteorites',       display: 'Meteorites',        extras: ['mass_g', 'meteorite_class', 'fall_type'] },
  'ufo_sightings':        { file: 'ufo-sightings',    display: 'UFO Sightings',     extras: ['shape', 'duration_seconds'] },
  'megalithic_portal':    { file: 'megaliths',        display: 'Megalithic Sites',  extras: ['type', 'heritage'] },
  'osm_ghost_towns':      { file: 'ghost-towns',      display: 'Ghost Towns',       extras: ['abandoned_year', 'abandoned_reason'] },
  'osm_caves':            { file: 'caves',            display: 'Caves',             extras: ['cave_type', 'cave_depth_m', 'cave_length_m'] },
  'noaa_tornadoes':       { file: 'tornadoes',        display: 'Tornadoes',         extras: ['magnitude', 'injuries', 'fatalities'] },
  'noaa_storm_events':    { file: 'storm-events',     display: 'Storm Events',      extras: ['event_type', 'magnitude', 'injuries', 'fatalities'] },
};

// Core fields every record gets
const CORE_FIELDS = ['latitude', 'longitude', 'name', 'description', 'date'];

console.log('Loading source data...');
const raw = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
console.log(`Loaded ${raw.length.toLocaleString()} records`);

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Also output a category manifest for the app to use
const manifest = [];

let totalOut = 0;

for (const [srcKey, config] of Object.entries(CATEGORY_MAP)) {
  const records = raw.filter(r => r.category === srcKey);

  // Strip to core + extras, drop nulls from extras
  const cleaned = records.map(r => {
    const out = {};
    for (const f of CORE_FIELDS) {
      out[f] = r[f] ?? null;
    }
    for (const f of config.extras) {
      const val = r[f];
      if (val !== null && val !== undefined) {
        out[f] = val;
      }
    }
    return out;
  });

  const outPath = path.join(OUT_DIR, `${config.file}.json`);
  const json = JSON.stringify(cleaned);
  fs.writeFileSync(outPath, json);

  const sizeMB = (Buffer.byteLength(json) / 1024 / 1024).toFixed(2);
  console.log(`  ${config.display.padEnd(20)} ${records.length.toLocaleString().padStart(8)} records → ${config.file}.json (${sizeMB} MB)`);

  manifest.push({
    id: config.file,
    sourceKey: srcKey,
    display: config.display,
    count: records.length,
    file: `${config.file}.json`,
  });

  totalOut += records.length;
}

// Write manifest
const manifestPath = path.join(OUT_DIR, 'categories.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`\nManifest → categories.json`);
console.log(`Total output: ${totalOut.toLocaleString()} records`);
console.log('Done.');
