import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { AnalogMatch } from '../models/AnalogMatch';
import { AnalogLocation } from '../models/AnalogLocation';

interface ComputedMatchInput {
  targetId: string;
  analogId: string;
  locationName: string;
  country: string;
  coordinates: { lat: number; lng: number };
  similarity: number;
  mahalanobisD2: number;
  worstFeature: string;
  breakdown: {
    geologyMatch: string;
    thermalMatch: string;
    limits: string;
  };
  matches: string[];
  suggestedTesting: string;
  provenance: {
    dataset: string;
    version: string;
    computedAt?: string;
  };
}

async function run() {
  const filePath = process.argv[2] || path.join(__dirname, '../../../pipeline/computed_matches.json');

  if (!fs.existsSync(filePath)) {
    logger.warn(`Computed matches file not found at: ${filePath}. Skipping import.`);
    process.exit(0);
  }

  logger.info(`Connecting to MongoDB Atlas to import computed analog matches...`);
  await mongoose.connect(env.MONGODB_URI);

  const raw = fs.readFileSync(filePath, 'utf-8');
  const items: ComputedMatchInput[] = JSON.parse(raw);

  logger.info(`Found ${items.length} computed matches to import.`);

  for (const item of items) {
    const doc = {
      ...item,
      source: 'computed' as const,
      provenance: {
        dataset: item.provenance.dataset,
        version: item.provenance.version,
        computedAt: item.provenance.computedAt ? new Date(item.provenance.computedAt) : new Date(),
      },
    };

    await AnalogMatch.findOneAndUpdate(
      { targetId: item.targetId, analogId: item.analogId },
      { $set: doc },
      { upsert: true, new: true },
    );

    // Also update overallSimilarity & provenance on the AnalogLocation if it exists
    await AnalogLocation.findOneAndUpdate(
      { id: item.analogId },
      {
        $set: {
          overallSimilarity: item.similarity,
          source: 'computed',
          provenance: {
            dataset: item.provenance.dataset,
            version: item.provenance.version,
            computedAt: new Date(),
          },
        },
      },
    );
  }

  logger.info(`Successfully imported ${items.length} computed matches.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  logger.error(err, 'Failed to import computed matches');
  process.exit(1);
});
