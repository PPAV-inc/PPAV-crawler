import { VideoCollection } from './models/schema';


const findThreeVideos = () => {
  return new Promise(resolve => {
    VideoCollection.aggregate()
    .sort({ count: -1 })
    .limit(50)
    .sample(3)
    .exec((err, docs) => {
       resolve(docs);
    });
  });
};

export default findThreeVideos;
