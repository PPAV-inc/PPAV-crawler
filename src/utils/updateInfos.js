const updateInfos = (db, foundInfos, skipInfos) => {
  const updateVideos = foundInfos.map(async info => {
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
  });

  const updateSkipVideos = skipInfos.map(info =>
    db
      .collection('skip_videos')
      .updateOne({ url: info.url }, info, { upsert: true })
  );

  const updateSources = foundInfos.map(info =>
    db
      .collection('sources')
      .updateOne(
        { url: info.url },
        { source: info.source, url: info.url, updatedAt: new Date() },
        { upsert: true }
      )
  );

  return Promise.all(updateVideos, updateSkipVideos, updateSources);
};

export default updateInfos;
