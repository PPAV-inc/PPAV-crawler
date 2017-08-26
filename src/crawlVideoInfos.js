import pMap from 'p-map';
import JavLibrary from './videoLib/JavLibrary';
import database from './database';
import updateVideosInfosFromJav from './utils/updateVideosInfosFromJav';

async function main() {
  const jav = new JavLibrary();
  const db = await database();

  const videos = await db
    .collection('videos')
    .find({ code: { $exists: true }, tags: null }, { code: 1 })
    .toArray();

  await pMap(
    videos,
    async video => {
      try {
        const videoInfos = await jav.getCodeInfos(video.code);
        console.log(
          `code: ${videoInfos.id},`,
          `length: ${videoInfos.length},`,
          `tags: ${videoInfos.tags}`
        );

        await updateVideosInfosFromJav(db, videoInfos);
      } catch (err) {
        console.error(err.message);
      }
    },
    { concurrency: 5 }
  );

  db.close();
}

export default main;
