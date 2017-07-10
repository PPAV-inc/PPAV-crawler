import { getDatabase } from './database';

const saveSearchInfo = async (keyword, type) => {
  const db = await getDatabase();

  await db
    .collection('search_keywords')
    .update(
      { type, keyword },
      { $inc: { count: 1 }, $set: { updated_at: new Date() } },
      { upsert: true });

  console.log(`update ${keyword} finished`);
};

export { saveSearchInfo };
