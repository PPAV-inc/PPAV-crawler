import pMap from 'p-map';

const updateInfos = async (db, foundInfos, skipInfos) => {
  // updateVideos
  await pMap(
    foundInfos,
    async info => {
      const result = await db
        .collection('videos')
        .findOne({ code: info.code, 'videos.source': info.source });

      if (!result) {
        await db.collection('videos').updateOne(
          { code: info.code },
          {
            $setOnInsert: {
              code: info.code,
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

  // updateSkipVideos
  await pMap(
    skipInfos,
    info =>
      db
        .collection('skip_videos')
        .updateOne({ url: info.url }, info, { upsert: true }),
    { concurrency: 5 }
  );

  // updateSources
  await pMap(
    foundInfos,
    info =>
      db
        .collection('sources')
        .updateOne(
          { url: info.url },
          { source: info.source, url: info.url, updatedAt: new Date() },
          { upsert: true }
        ),
    { concurrency: 5 }
  );

  await pMap(
    skipInfos,
    info =>
      db.collection('sources').updateOne(
        { url: info.url },
        {
          source: info.source,
          url: info.url,
          updatedAt: new Date(),
          skippedAt: new Date(),
        },
        { upsert: true }
      ),
    { concurrency: 5 }
  );
};

export default updateInfos;
