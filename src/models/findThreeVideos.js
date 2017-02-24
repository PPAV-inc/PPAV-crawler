import { NewVideoCollection, VideoCollection } from './schema';


const findThreeVideos = (isNew = false) => {
    const collection = isNew ? NewVideoCollection : VideoCollection;

    return new Promise(resolve => {
        collection.aggregate()
        .sort({ count: -1 })
        .limit(10)
        .sample(3)
        .exec((err, docs) => {
            resolve(docs);
         });
    });
};

export default findThreeVideos;
