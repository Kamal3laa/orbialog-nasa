import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export async function connectDB(): Promise<void> {
  mongoose.connection.on('connected', () => logger.info('MongoDB connected'));
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  mongoose.connection.on('error', (err) => logger.error({ err }, 'MongoDB error'));

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
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
