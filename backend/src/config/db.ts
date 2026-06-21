import dns from 'dns';

// Force Node.js to use Google DNS to bypass mobile hotspot restrictions
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';

export async function connectToDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set in the environment');
  }
  await mongoose.connect(uri);
  console.log('[db] connected to MongoDB');
}