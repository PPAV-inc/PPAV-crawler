import pMap from 'p-map';
import differenceInMinutes from 'date-fns/difference_in_minutes';

// import IndexAV from './videoLib/IndexAV';
import JavLib from './videoLib/JavLibrary';
import database from './database';
import { YouAV, MyAVSuper, Avgle, JavMost, Iavtv } from './AV';
import updateInfos from './utils/updateInfos';

async function getVideosInfos(videos) {
  // const indexav = new IndexAV();
  const jav = new JavLib();
  const now = new Date();
  const foundInfos = [];
  const skipInfos = [];

  await pMap(
    videos,
    async video => {
      // const info = await indexav.getCodeInfo(video.code);
      let info;
      try {
        info = await jav.getCodeInfos(video.code);
      } catch (err) {
        console.error(err.message);
      }

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
    { concurrency: 20 }
  );
  return { foundInfos, skipInfos };
}

const main = async () => {
  const start = new Date();
  console.log(`crawler start at ${start}`);

  const avs = [new YouAV(), new MyAVSuper(), new Avgle()];

  const db = await database();
  const searchs = await db
    .collection('hot_search_keywords')
    .aggregate([
      {
        $group: {
          _id: '$keyword',
          keyword: { $first: '$keyword' },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gte: process.env.COUNT || 30 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ])
    .toArray();

  const existedVideos = await db.collection('sources').find().toArray();
  const existedVideosSet = new Set(existedVideos.map(video => video.url));

  for (const search of searchs) {
    console.log(`search keyword: ${search.keyword}`);
    console.log(`search count: ${search.count}`);

    // FIXME: concurrency
    for (const av of avs) {
      try {
        console.log(`search from av: ${av.source}`);
        let videos = await av.getVideos(search.keyword);

        videos = videos.filter(
          video =>
            video.source === av.source && !existedVideosSet.has(video.url)
        );
        console.log(`videos length: ${videos.length}`);

        const { foundInfos, skipInfos } = await getVideosInfos(videos);

        await updateInfos(db, foundInfos, skipInfos);

        console.log('================================');
        console.log(`search keyword: ${search.keyword}, from: ${av.source}`);
        console.log(`find video url count: ${foundInfos.length}`);
        console.log(`skip video url count: ${skipInfos.length}`);
        console.log('================================');
      } catch (err) {
        console.error(err);
      }
    }
  }

  /* different crawler */
  const newAVSources = [new JavMost(), new Iavtv()];

  for (const av of newAVSources) {
    console.log(`search from av: ${av.source}`);
    let videos = await av.getVideos();

    videos = videos.filter(
      video => video.source === av.source && !existedVideosSet.has(video.url)
    );
    console.log(`videos length: ${videos.length}`);

    const { foundInfos, skipInfos } = await getVideosInfos(videos);

    await updateInfos(db, foundInfos, skipInfos);

    console.log('================================');
    console.log(`from: ${av.source}`);
    console.log(`find video url count: ${foundInfos.length}`);
    console.log(`skip video url count: ${skipInfos.length}`);
    console.log('================================');
  }

  const done = new Date();
  console.log(`crawler done at ${done}`);
  console.log(`take ${differenceInMinutes(done, start)} mins`);

  db.close();
};

module.exports = main;
