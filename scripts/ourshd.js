require('babel-register');

const fs = require('fs');
const pMap = require('p-map');
const _debug = require('debug');

const JavLib = require('../src/videoLib/JavLibrary').default;
const database = require('../src/database').default;

const debug = _debug('crawler');

(async () => {
  const text = fs.readFileSync('./video.json');
  const videos = JSON.parse(text);
  const jav = new JavLib();
  const now = new Date();
  const foundInfos = [];
  const skipInfos = [];
  const db = await database();

  await pMap(
    videos,
    async video => {
      const _video = {
        source: 'ourshdtv',
        url: `http://ourshdtv.com/video/?vid=${video.vid}`,
      };
      const vcode = video.vcode.replace('_', '-').toUpperCase();

      const codes = []
        .concat(vcode.match(/\w+-\d+/g), vcode.match(/\w+-\w+-\d+/g))
        // filter not match
        .filter(code => !!code);

      for (const code of codes) {
        try {
          const info = await jav.getCodeInfos(code);

          foundInfos.push({ ...info, ..._video, updated_at: now });
          debug(`find url: ${_video.url}, code: ${_video.code}`);
          break;
        } catch (err) {
          skipInfos.push({ ..._video, updated_at: now });
          debug(err.message);
        }
      }
    },
    { concurrency: 10 }
  );

  await pMap(
    foundInfos,
    async info => {
      const result = await db
        .collection('videos')
        .findOne({ code: info.id, 'videos.source': info.source });

      if (!result) {
        await db.collection('videos').updateOne(
          { code: info.id },
          {
            $setOnInsert: {
              code: info.id,
              title: info.title,
              models: info.models,
              img_url: info.imgUrl,
              publishedAt: info.publishedAt,
              length: info.length,
              score: info.score,
              tags: info.tags,
              total_view_count: 0,
            },
            $push: {
              videos: {
                source: info.source,
                url: info.url,
                view_count: 0,
              },
            },
            $set: {
              updated_at: info.updated_at,
            },
          },
          { upsert: true }
        );
      }
    },
    { concurrency: 5 }
  );

  console.log(`find video url count: ${foundInfos.length}`);
  console.log(`skip video url count: ${skipInfos.length}`);

  await db.close();
})();
