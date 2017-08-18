const updateVideosInfosFromJav = async (db, videoInfos) => {
  await db.collection('videos').updateOne(
    { code: videoInfos.id },
    {
      $set: {
        score: videoInfos.score,
        length: videoInfos.length,
        publishedAt: videoInfos.publishedAt,
      },
      $addToSet: { tags: { $each: videoInfos.tags } },
    }
  );
};

export default updateVideosInfosFromJav;
