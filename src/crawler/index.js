import IndexAV from './indexav';
import database from './database';
import YouAV from './AV/youav';
import MyAVSuper from './AV/myavsuper';
import Avgle from './AV/avgle';

const test = async () => {
  const avs = [new YouAV(), new MyAVSuper(), new Avgle()];

  const db = await database();
  const searchs = await db
    .collection('search_keywords')
    .find({ count: { $gt: 100 } })
    .sort({ count: -1 })
    .skip(1)
    .toArray();
  const indexav = new IndexAV();

  for (const search of searchs) {
    console.log(`search keyword: ${search.keyword}, count: ${search.count}`);

    for (const av of avs) {
      console.log(`search from av: ${av.source}`);
      const videos = await av.getVideos(search.keyword);

      const infos = [];

      for (const each of videos) {
        const info = await indexav.getCodeInfo(each.code);

        if (info && info.title !== '') {
          infos.push({ ...info, ...each });
        } else {
          console.log(`skip url: ${each.url}, code: ${each.code}`);
        }
      }

      await Promise.all(
        infos.map(async info => {
          await db
            .collection('videos')
            .updateOne({ url: info.url }, info, { upsert: true });
        })
      );

      console.log(`video url count: ${infos.length}`);
    }

    break;
  }

  db.close();
};

test();
