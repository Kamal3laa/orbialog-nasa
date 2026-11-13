/**
 * Seed script — Phase 3
 *
 * Reads mock data from the frontend's data files (copied into seed-data/)
 * and upserts each document into MongoDB Atlas by its `id` field.
 *
 * Run with:  npm run seed
 */
import 'dotenv/config';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { PlanetaryTarget } from '../models/PlanetaryTarget';
import { AnalogLocation } from '../models/AnalogLocation';
import { MissionDiscipline } from '../models/MissionDiscipline';
import { MethodologyStep } from '../models/MethodologyStep';

// Import the mock data directly from the frontend's data folder
// (relative path from backend/src/scripts → ui ux mock/src/data)
import { PLANETARY_TARGETS } from '../../seed-data/planetaryTargets';
import { ANALOG_LOCATIONS } from '../../seed-data/analogLocations';
import { MISSION_APPLICATION_DOMAINS } from '../../seed-data/missionApplications';
import { METHODOLOGY_STEPS } from '../../seed-data/methodologyData';

async function seed(): Promise<void> {
  logger.info('Connecting to MongoDB Atlas…');
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10_000 });
  logger.info('Connected');

  // ── Planetary Targets ────────────────────────────────────────────────────
  logger.info(`Upserting ${PLANETARY_TARGETS.length} planetary targets…`);
  for (const t of PLANETARY_TARGETS) {
    await PlanetaryTarget.findOneAndUpdate(
      { id: t.id },
      { $set: t },
      { upsert: true, new: true, runValidators: true },
    );
  }

  // ── Analog Locations ─────────────────────────────────────────────────────
  logger.info(`Upserting ${ANALOG_LOCATIONS.length} analog locations…`);
  for (const a of ANALOG_LOCATIONS) {
    // Convert {lat, lng} → GeoJSON [lng, lat] for 2dsphere queries
    const doc = {
      ...a,
      location: {
        type: 'Point' as const,
        coordinates: [a.coordinates.lng, a.coordinates.lat] as [number, number],
      },
    };
    await AnalogLocation.findOneAndUpdate(
      { id: a.id },
      { $set: doc },
      { upsert: true, new: true, runValidators: true },
    );
  }

  // ── Mission Disciplines ───────────────────────────────────────────────────
  logger.info(`Upserting ${MISSION_APPLICATION_DOMAINS.length} mission disciplines…`);
  for (const d of MISSION_APPLICATION_DOMAINS) {
    await MissionDiscipline.findOneAndUpdate(
      { id: d.id },
      { $set: d },
      { upsert: true, new: true, runValidators: true },
    );
  }

  // ── Methodology Steps ─────────────────────────────────────────────────────
  logger.info(`Upserting ${METHODOLOGY_STEPS.length} methodology steps…`);
  for (const s of METHODOLOGY_STEPS) {
    await MethodologyStep.findOneAndUpdate(
      { stepNumber: s.stepNumber },
      { $set: s },
      { upsert: true, new: true, runValidators: true },
    );
  }

  // ── Integrity check ───────────────────────────────────────────────────────
  const targetCount = await PlanetaryTarget.countDocuments();
  const siteCount = await AnalogLocation.countDocuments();
  const disciplineCount = await MissionDiscipline.countDocuments();
  const stepCount = await MethodologyStep.countDocuments();
  logger.info(
    `Seed complete — Targets: ${targetCount}, Sites: ${siteCount}, Disciplines: ${disciplineCount}, Steps: ${stepCount}`,
  );

  // Verify cross-references
  for (const site of ANALOG_LOCATIONS) {
    for (const tid of site.matchedTargets) {
      const exists = await PlanetaryTarget.exists({ id: tid });
      if (!exists) {
        logger.warn(`⚠  Site '${site.id}' references unknown target '${tid}'`);
      }
    }
  }
  for (const target of PLANETARY_TARGETS) {
    for (const aid of target.recommendedAnalogs) {
      const exists = await AnalogLocation.exists({ id: aid });
      if (!exists) {
        logger.warn(`⚠  Target '${target.id}' references unknown analog '${aid}'`);
      }
    }
  }

  await mongoose.disconnect();
  logger.info('Done ✓');
}

seed().catch((err) => {
  logger.error({ err }, 'Seed failed');
  process.exit(1);
});
