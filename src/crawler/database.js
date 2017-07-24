import { MongoClient } from 'mongodb';

const config = require('../../config.json');

const MONGO_URL =
  process.env.NODE_ENV === 'production'
    ? config.MONGO_URL
    : 'mongodb://localhost:27017/ppav';

let _db;
const getDatabase = async () => {
  if (_db) {
    return _db;
  }

  const db = await MongoClient.connect(MONGO_URL);
  _db = db;
  return _db;
};

export default getDatabase;
