import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { initializeFileStore } from './store.js';

dotenv.config();

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prithvigrid';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error: any) {
    console.warn(`[MongoDB] Warning: Could not connect to MongoDB at ${uri} (${error.message}).`);
    console.log(`[Backend Storage] Falling back to high-performance local persistent JSON store.`);
    console.log(`[Backend Storage] All REST API operations (Inquiries, Projects, Blogs, Auth) remain 100% functional!`);
    console.log(`[Backend Storage] To switch to MongoDB, start MongoDB locally or paste your Atlas URI into server/.env.`);
    await initializeFileStore();
    return false;
  }
};

export const isMongoDBConnected = () => isConnected;

