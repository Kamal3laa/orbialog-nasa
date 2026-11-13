import dns from 'dns';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../utils/logger';

// Ensure reliable SRV record resolution regardless of local DNS / ISP issues
dns.setServers(['8.8.8.8', '1.1.1.1']);

export async function connectDB(): Promise<void> {
  mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  mongoose.connection.on('error', (err) => logger.error({ err }, 'MongoDB error'));

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
    autoIndex: env.NODE_ENV !== 'production',
  });
}

export async function closeDB(): Promise<void> {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
}

export function dbReady(): boolean {
  return mongoose.connection.readyState === 1;
}
