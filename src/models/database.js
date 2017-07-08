import jsonfile from 'jsonfile';
// import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import path from 'path';

const jsonPath = path.join(__dirname, '..', '..', 'config.json');
const config = jsonfile.readFileSync(jsonPath);

const getDatabase = async () => {
  // const db = await MongoClient.connect(config.MONGODB_PATH);
  const db = await MongoClient.connect('mongodb://localhost:27017/ppav');
  return db;
};

export {
  getDatabase,
};
