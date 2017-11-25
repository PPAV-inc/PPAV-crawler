require('babel-register');

const pMap = require('p-map');
const { ObjectId } = require('mongodb');

const JavLib = require('../src/videoLib/JavLibrary').default;
const database = require('../src/database').default;

async function main() {
  const jav = new JavLib();
  const db = await database();

  const videos = await db.collection('videos').find().toArray();

  await pMap(videos, async ({ _id, code }) => {
    const { id } = await jav.getCodeInfos(code);

    await db
      .collection('videos')
      .updateOne({ _id: ObjectId(_id) }, { $set: { code: id } });
  });
}

main();
