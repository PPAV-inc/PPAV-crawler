import { getDatabase } from './database';

const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const getVideo = async (type, messageText) => {
  const text = escapeRegex(messageText);
  const query = {};
  query[type] = {
    $regex: text,
    $options: 'gi',
  };

  const db = await getDatabase();
  const results = await db.collection('videos')
    .find(query)
    .sort({ count: -1 })
    .toArray();
  return {
    searchValue: text,
    results,
  };
};

const getRandomThreeVideos = async () => {
  const db = await getDatabase();
  const results = await db.collection('videos')
    .aggregate([
      { $sort: { count: -1 } },
      { $limit: 50 },
      { $sample: { size: 3 } },
    ])
    .toArray();
  return {
    searchValue: 'PPAV',
    results,
  };
};

export { getVideo, getRandomThreeVideos };
