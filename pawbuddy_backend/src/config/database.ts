import mongoose from 'mongoose';
import { env } from './environment.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log(' MongoDB connected successfully');
  } catch (error) {
    console.error(' MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('  MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error(' MongoDB error:', error);
});

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log(' MongoDB disconnected successfully');
  } catch (error) {
    console.error(' Error disconnecting from MongoDB:', error);
  }
};

export default mongoose;

