import { MongoClient } from 'mongodb';

const MONGO_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.PROD_MONGO_URL
    : process.env.DEV_MONGO_URL;

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
