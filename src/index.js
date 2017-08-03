import IndexAV from './indexav';
import database from './database';
import YouAV from './AV/youav';
import MyAVSuper from './AV/myavsuper';
import Avgle from './AV/avgle';

const main = async () => {
  const avs = [new YouAV(), new MyAVSuper(), new Avgle()];

  const db = await database();
  const searchs = await db
    .collection('search_keywords')
    .find({ count: { $gte: 100, $lte: 340 } })
    .sort({ count: -1 })
    .toArray();
  const indexav = new IndexAV();
  const now = new Date();

  for (const search of searchs) {
    console.log(`search keyword: ${search.keyword}`);
    console.log(`search count: ${search.count}`);

    for (const av of avs) {
      console.log(`search from av: ${av.source}`);
      const videos = await av.getVideos(search.keyword);

      const foundInfos = [];
      const skipInfos = [];

      for (const each of videos) {
        const info = await indexav.getCodeInfo(each.code);

        if (info && info.title !== '') {
          foundInfos.push({ ...info, ...each, updated_at: now });
          console.log(`find url: ${each.url}, code: ${each.code}`);
        } else if (
          !foundInfos.some(foundInfo => foundInfo.url === each.url) &&
          !skipInfos.some(skipInfo => skipInfo.url === each.url)
        ) {
          skipInfos.push({ ...each, updated_at: now });
          console.log(`skip url: ${each.url}, code: ${each.code}`);
        } else {
          console.log(`same url, different code: ${each.code}`);
        }
      }

      await Promise.all(
        foundInfos.map(async info => {
          await db
            .collection('videos')
            .updateOne({ url: info.url }, info, { upsert: true });
        }),
        skipInfos.map(async info => {
          await db
            .collection('skip_videos')
            .updateOne({ url: info.url }, info, { upsert: true });
        })
      );

      console.log('================================');
      console.log(`search keyword: ${search.keyword}, from: ${av.source}`);
      console.log(`find video url count: ${foundInfos.length}`);
      console.log(`skip video url count: ${skipInfos.length}`);
      console.log('================================');
    }
  }

  db.close();
};

main().catch(console.error);
