import { NewVideoCollection } from './schema';


const findThreeNewVideos = () => {
  return new Promise(resolve => {
    NewVideoCollection.aggregate()
    .sort({ count: -1 })
    .limit(10)
    .sample(3)
    .exec((err, docs) => {
       resolve(docs);
    });
  });
};

export default findThreeNewVideos;
