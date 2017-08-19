import JavLibrary from './videoLib/JavLibrary';
import database from './database';
import updateVideosInfosFromJav from './utils/updateVideosInfosFromJav';

async function main() {
  const jav = new JavLibrary();
  const db = await database();

  const videos = await db
    .collection('videos')
    .find({ code: { $exists: true } }, { code: 1 })
    .toArray();

  for (const video of videos) {
    try {
      const videoInfos = await jav.getCodeInfos(video.code);
      console.log(videoInfos);
      await updateVideosInfosFromJav(db, videoInfos);
    } catch (err) {
      console.error(err.message);
    }
  }

  db.close();
}

export default main;
