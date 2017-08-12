const updateInfos = async (db, foundInfos, skipInfos) => {
  await Promise.all(
    foundInfos.map(async info => {
      const result = await db
        .collection('videos')
        .findOne({ code: info.code, 'videos.source': info.source });

      if (!result) {
        await db.collection('videos').updateOne(
          { code: info.code },
          {
            $setOnInsert: {
              title: info.title,
              models: info.models,
              img_url: info.img_url,
              code: info.code,
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
    }),
    skipInfos.map(async info => {
      await db
        .collection('skip_videos')
        .updateOne({ url: info.url }, info, { upsert: true });
    })
  );
};

export default updateInfos;
