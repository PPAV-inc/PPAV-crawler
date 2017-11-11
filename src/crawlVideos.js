import pMap from 'p-map';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import _debug from 'debug';

import JavLib from './videoLib/JavLibrary';
import database from './database';
import { YouAV, MyAVSuper, Avgle, JavMost, Iavtv, Yahan } from './AV';
import updateInfos from './utils/updateInfos';

const debug = _debug('crawler');

async function getVideosInfos(videos) {
  const jav = new JavLib();
  const now = new Date();
  const foundInfos = [];
  const skipInfos = [];

  await pMap(
    videos,
    async video => {
      try {
        const info = await jav.getCodeInfos(video.code);

        foundInfos.push({ ...info, ...video, updated_at: now });
        debug(`find url: ${video.url}, code: ${video.code}`);
      } catch (err) {
        // will get error if code not found
        skipInfos.push({ ...video, updated_at: now });
        debug(err.message);
      }
    },
    { concurrency: 20 }
  );
  return { foundInfos, skipInfos };
}

const main = async () => {
  const start = new Date();
  console.log(`crawler start at ${start}`);

  const db = await database();

  const existedVideos = await db.collection('sources').find().toArray();
  const existedVideosSet = new Set(existedVideos.map(video => video.url));

  const newAVSources = [
    new YouAV(),
    new MyAVSuper(),
    new Avgle(),
    new JavMost(),
    new Iavtv(),
    new Yahan(),
  ];

  await pMap(
    newAVSources,
    async av => {
      console.log(`search from av: ${av.source}`);
      let videos = await av.getVideos();

      videos = videos.filter(video => !existedVideosSet.has(video.url));
      console.log(`videos length: ${videos.length}`);

      const { foundInfos, skipInfos } = await getVideosInfos(videos);

      await updateInfos(db, foundInfos, skipInfos);

      console.log('================================');
      console.log(`from: ${av.source}`);
      console.log(`find video url count: ${foundInfos.length}`);
      console.log(`skip video url count: ${skipInfos.length}`);
      console.log('================================');
    },
    { concurrency: 3 }
  );

  const done = new Date();
  console.log(`crawler done at ${done}`);
  console.log(`take ${differenceInMinutes(done, start)} mins`);

  db.close();
};

module.exports = main;
