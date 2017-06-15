import { MongoClient } from 'mongodb';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/ppav';

export default async () => {
  return MongoClient.connect(MONGO_URL);
};
