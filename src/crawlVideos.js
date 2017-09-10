import pMap from 'p-map';

import IndexAV from './videoLib/IndexAV';
import database from './database';
import { YouAV, MyAVSuper, Avgle } from './AV';
import updateInfos from './utils/updateInfos';

const main = async () => {
  const avs = [new YouAV(), new MyAVSuper(), new Avgle()];

  const db = await database();
  const searchs = await db
    .collection('hot_search_keywords')
    .aggregate([
      {
        $group: {
          _id: '$keyword',
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gte: 100 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ])
    .toArray();

  const indexav = new IndexAV();
  const now = new Date();

  for (const search of searchs) {
    console.log(`search keyword: ${search.keyword}`);
    console.log(`search count: ${search.count}`);

    // FIXME: concurrency
    for (const av of avs) {
      console.log(`search from av: ${av.source}`);
      const videos = await av.getVideos(search.keyword);

      const foundInfos = [];
      const skipInfos = [];

      await pMap(
        videos,
        async video => {
          const info = await indexav.getCodeInfo(video.code);

          if (info && info.title !== '') {
            foundInfos.push({ ...info, ...video, updated_at: now });
            console.log(`find url: ${video.url}, code: ${video.code}`);
          } else if (
            !foundInfos.some(foundInfo => foundInfo.url === video.url) &&
            !skipInfos.some(skipInfo => skipInfo.url === video.url)
          ) {
            skipInfos.push({ ...video, updated_at: now });
            console.log(`skip url: ${video.url}, code: ${video.code}`);
          } else {
            console.log(`same url, different code: ${video.code}`);
          }
        },
        { concurrency: 5 }
      );

      await updateInfos(db, foundInfos, skipInfos);

      console.log('================================');
      console.log(`search keyword: ${search.keyword}, from: ${av.source}`);
      console.log(`find video url count: ${foundInfos.length}`);
      console.log(`skip video url count: ${skipInfos.length}`);
      console.log('================================');
    }
  }

  db.close();
};

module.exports = main;
